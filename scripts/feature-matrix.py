#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
dsh-xueqiu 功能矩阵测试（资深 QA 视角）
覆盖全部 20 个 RPC 动作 × {正常, 边界, 非法, 降级} × 登录态。

用法:
  python3 scripts/feature-matrix.py --base http://127.0.0.1:PORT --mode unlogged
  python3 scripts/feature-matrix.py --base http://127.0.0.1:PORT --mode logged
  python3 scripts/feature-matrix.py --base http://127.0.0.1:PORT --mode expired

  --mode unlogged  隔离实例（无登录文件）: 公开接口 + 默认自选 + 登录拒绝路径
  --mode logged    已登录实例: 真实数据 + 自选增删往返(净值归零) + 云端拉取
  --mode expired   Cookie 过期实例: login.status 应报 expired

退出码 0=全部通过, 1=有失败。
"""
import argparse
import json
import sys
import urllib.request
import urllib.error

PASS = 0
FAIL = 0
RESULTS = []


def rpc(base, action, args=None, origin=None):
    body = json.dumps({"action": action, "args": args or {}}).encode()
    req = urllib.request.Request(
        base + "/xq-rpc", data=body,
        headers={"Content-Type": "application/json",
                 "Origin": origin or base},
        method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode())
        except Exception:
            return e.code, {}
    except Exception as e:
        return -1, {"ok": False, "error": str(e)}


def check(name, cond, detail=""):
    global PASS, FAIL
    if cond:
        PASS += 1
        RESULTS.append(("PASS", name))
    else:
        FAIL += 1
        RESULTS.append(("FAIL", name + ("  <- " + detail if detail else "")))


def ok_data(code, resp):
    return code == 200 and resp.get("ok") is True and "data" in resp


def err_data(code, resp):
    return code == 200 and resp.get("ok") is False and resp.get("error")


def suite_common_quote(base):
    """行情: 单只/批量/非法过滤/空/混合"""
    c, r = rpc(base, "quote", {"symbols": "SH600519"})
    d = r.get("data") or {}
    check("quote 单只成功", ok_data(c, r) and len(d.get("list") or []) == 1
          and (d.get("list") or [{}])[0].get("symbol") == "SH600519",
          json.dumps(r)[:200])
    c, r = rpc(base, "quote", {"symbols": ["SH600519", "SZ300750", "00700", "AAPL"]})
    d = r.get("data") or {}
    syms = [x.get("symbol") for x in (d.get("list") or [])]
    check("quote 批量4只", ok_data(c, r) and len(syms) == 4, json.dumps(r)[:200])
    c, r = rpc(base, "quote", {"symbols": ["SH600519", "!!!invalid!!!", "SELECT*1"]})
    d = r.get("data") or {}
    check("quote 非法符号被过滤(只剩合法)", ok_data(c, r) and len(d.get("list") or []) == 1,
          json.dumps(r)[:200])
    c, r = rpc(base, "quote", {"symbols": "///bad///"})
    d = r.get("data") or {}
    check("quote 全非法返回空列表不崩溃", ok_data(c, r) and d.get("list") == [],
          json.dumps(r)[:200])
    c, r = rpc(base, "quote", {})
    check("quote 缺参不崩溃", ok_data(c, r), json.dumps(r)[:200])
    c, r = rpc(base, "quote", {"symbols": "SH600519"})
    check("quote 字段完整(含名称/价格/涨跌幅)",
          ok_data(c, r) and all(k in ((r.get("data") or {}).get("list") or [{}])[0]
                                for k in ("name", "current", "percent")),
          json.dumps(r)[:200])


def suite_detail_kline_minute(base):
    c, r = rpc(base, "quoteDetail", {"symbol": "SH600519"})
    check("quoteDetail 成功", ok_data(c, r) and (r.get("data") or {}).get("quote"),
          json.dumps(r)[:200])
    for period, minbars in [("day", 5), ("week", 5), ("month", 5),
                            ("1m", 5), ("5m", 5), ("15m", 5), ("30m", 5), ("60m", 5)]:
        c, r = rpc(base, "kline", {"symbol": "SH600519", "period": period, "count": 30})
        d = r.get("data") or {}
        items = d.get("rows") or d.get("items") or d.get("list") or []
        check("kline period=%s" % period, ok_data(c, r) and len(items) >= minbars,
              json.dumps(r)[:200])
    c, r = rpc(base, "kline", {"symbol": "SH600519", "period": "day", "count": 1})
    d = r.get("data") or {}
    check("kline count 下限钳制(1→5)", ok_data(c, r) and len(d.get("rows") or []) >= 5,
          json.dumps(r)[:150])
    c, r = rpc(base, "kline", {"symbol": "SH600519", "period": "day", "count": 9999})
    check("kline count 上限钳制(9999→500)不崩溃", ok_data(c, r), json.dumps(r)[:150])
    c, r = rpc(base, "kline", {"symbol": "NOT_EXIST", "period": "day"})
    check("kline 不存在代码降级不崩溃", ok_data(c, r) or err_data(c, r), json.dumps(r)[:150])
    c, r = rpc(base, "minute", {"symbol": "SH600519"})
    d = r.get("data") or {}
    check("minute 分时成功", ok_data(c, r) and isinstance(d.get("items"), list),
          json.dumps(r)[:200])
    c, r = rpc(base, "minute", {"symbol": "NOT_EXIST"})
    check("minute 不存在代码返回空不崩溃", ok_data(c, r), json.dumps(r)[:150])


def suite_hot_search_news(base):
    for mkt in ("cn", "us", "hk", "global"):
        c, r = rpc(base, "hot", {"market": mkt, "size": 10})
        d = r.get("data") or {}
        check("hot market=%s" % mkt, ok_data(c, r) and len(d.get("list") or []) >= 1,
              json.dumps(r)[:200])
    c, r = rpc(base, "hot", {"market": "cn", "size": 999})
    d = r.get("data") or {}
    check("hot size 上限钳制(999→30)", ok_data(c, r) and len(d.get("list") or []) <= 30,
          json.dumps(r)[:150])
    c, r = rpc(base, "hot", {"market": "bogus"})
    check("hot 非法市场回退 cn 不崩溃", ok_data(c, r), json.dumps(r)[:150])
    c, r = rpc(base, "search", {"q": "茅台"})
    d = r.get("data") or {}
    check("search 中文查询", ok_data(c, r) and len(d.get("list") or []) >= 1,
          json.dumps(r)[:200])
    c, r = rpc(base, "search", {"q": ""})
    d = r.get("data") or {}
    check("search 空查询返回空", ok_data(c, r) and d.get("list") == [], json.dumps(r)[:150])
    c, r = rpc(base, "searchPosts", {"q": "A股", "count": 5})
    d = r.get("data") or {}
    check("searchPosts 成功", ok_data(c, r) and len(d.get("list") or []) >= 1,
          json.dumps(r)[:200])
    c, r = rpc(base, "news", {"count": 10})
    d = r.get("data") or {}
    items = d.get("items") or []
    check("news 第1页", ok_data(c, r) and len(items) >= 1, json.dumps(r)[:200])
    if items:
        oldest = items[-1].get("id")
        c, r = rpc(base, "news", {"count": 10, "max_id": oldest})
        d2 = r.get("data") or {}
        newer = all((it.get("id") or 0) <= oldest for it in (d2.get("items") or []))
        check("news 翻页游标(max_id)单调", ok_data(c, r) and len(d2.get("items") or []) >= 1
              and newer, json.dumps(r)[:200])


def suite_kol_user_finance(base):
    c, r = rpc(base, "kol", {"symbol": "SH600519"})
    check("kol 成功或空降级", ok_data(c, r), json.dumps(r)[:150])
    # 从 KOL 接口动态取一个真实用户 id，避免硬编码失效
    c, r = rpc(base, "kol", {"symbol": "SH600519"})
    kol_list = ((r.get("data") or {}).get("list")) or []
    uid = None
    for u in kol_list:
        uid = u.get("id") or u.get("uid") or u.get("user_id")
        if uid:
            break
    c, r = rpc(base, "user", {"userId": str(uid)} if uid else {"userId": "1234567890"})
    d = r.get("data") or {}
    check("user 时间线+资料", ok_data(c, r) and (d.get("user") or d.get("posts") is not None),
          json.dumps(r)[:200])
    c, r = rpc(base, "user", {})
    d = r.get("data") or {}
    check("user 缺 id 返回空不崩溃", ok_data(c, r) and d.get("user") is None,
          json.dumps(r)[:150])
    c, r = rpc(base, "finance", {"symbol": "SH600519"})
    d = r.get("data") or {}
    check("finance 财务指标", ok_data(c, r) and (d.get("list") is not None),
          json.dumps(r)[:200])


def suite_watchlist_local(base, mode):
    c, r = rpc(base, "watchlist.get")
    d = r.get("data") or {}
    syms = d.get("symbols") or []
    if mode == "unlogged":
        check("watchlist.get 未登录=默认6只",
              ok_data(c, r) and "SH600519" in syms and len(syms) >= 6,
              json.dumps(r)[:200])
    else:
        check("watchlist.get 已登录返回列表", ok_data(c, r) and len(syms) >= 1,
              json.dumps(r)[:200])
    c, r = rpc(base, "watchlist.add", {"symbol": "SH600000"})
    check("watchlist.add 合法代码", ok_data(c, r), json.dumps(r)[:200])
    c, r = rpc(base, "watchlist.get")
    check("watchlist.add 后在列表中",
          "SH600000" in ((r.get("data") or {}).get("symbols") or []),
          json.dumps(r)[:200])
    c, r = rpc(base, "watchlist.remove", {"symbol": "SH600000"})
    check("watchlist.remove 成功", ok_data(c, r), json.dumps(r)[:200])
    c, r = rpc(base, "watchlist.get")
    check("watchlist.remove 后不在列表中(净值归零)",
          "SH600000" not in ((r.get("data") or {}).get("symbols") or []),
          json.dumps(r)[:200])
    c, r = rpc(base, "watchlist.add", {"symbol": "DROP TABLE--"})
    check("watchlist.add 非法代码被拒", err_data(c, r), json.dumps(r)[:150])


def suite_login(base, mode):
    c, r = rpc(base, "login.status")
    d = r.get("data") or {}
    if mode == "unlogged":
        check("login.status 未登录=false", ok_data(c, r) and d.get("loggedIn") is False,
              json.dumps(r)[:200])
    elif mode == "logged":
        check("login.status 已登录=true", ok_data(c, r) and d.get("loggedIn") is True
              and d.get("uid"), json.dumps(r)[:200])
    elif mode == "expired":
        check("login.status 过期Cookie 报 expired", ok_data(c, r)
              and d.get("loggedIn") is False and d.get("expired") is True,
              json.dumps(r)[:200])
    c, r = rpc(base, "watchlist.pull")
    if mode == "unlogged":
        check("watchlist.pull 未登录报错(可操作)", err_data(c, r), json.dumps(r)[:200])
    elif mode == "expired":
        check("watchlist.pull 过期Cookie 报错(可操作)", err_data(c, r), json.dumps(r)[:200])
    else:
        check("watchlist.pull 已登录返回符号", ok_data(c, r)
              and len((r.get("data") or {}).get("symbols") or []) >= 1,
              json.dumps(r)[:200])
    if mode == "unlogged":
        c, r = rpc(base, "login.save", {"cookie": "garbage-no-token"})
        check("login.save 缺 xq_a_token 被拒", err_data(c, r), json.dumps(r)[:200])
        c, r = rpc(base, "login.save", {"cookie": ""})
        check("login.save 空 Cookie 被拒", err_data(c, r), json.dumps(r)[:200])


def suite_ui(base):
    c, r = rpc(base, "ui.get")
    d = r.get("data") or {}
    check("ui.get 返回默认结构", ok_data(c, r)
          and d.get("tab") == "market" and d.get("open") in (True, False),
          json.dumps(r)[:200])
    c, r = rpc(base, "ui.set", {"badgeW": 9999})
    check("ui.set badgeW 超限被钳制", ok_data(c, r), json.dumps(r)[:150])
    c, r = rpc(base, "ui.get")
    check("ui.get badgeW≤480", ((r.get("data") or {}).get("badgeW") or 0) <= 480,
          json.dumps(r)[:200])
    c, r = rpc(base, "ui.set", {"badgeW": 320, "tab": "market"})
    check("ui.set 正常值", ok_data(c, r), json.dumps(r)[:150])
    c, r = rpc(base, "ui.set", {"badgeW": "NaN!"})
    check("ui.set 非数值不崩溃", ok_data(c, r), json.dumps(r)[:150])


def suite_security(base):
    c, r = rpc(base, "quote", {"symbols": "SH600519"}, origin="http://evil.example")
    check("安全栅栏: 恶意 Origin 403", c == 403, "code=%s" % c)
    c, r = rpc(base, "unknown.action")
    check("未知 action 返回错误不崩溃", err_data(c, r), json.dumps(r)[:150])
    c, r = rpc(base, "quote", {"symbols": {"injection": 1}})
    check("quote 非字符串符号不崩溃", ok_data(c, r), json.dumps(r)[:150])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True)
    ap.add_argument("--mode", required=True,
                    choices=["unlogged", "logged", "expired"])
    a = ap.parse_args()

    suites = [
        ("行情 quote", suite_common_quote),
        ("详情/K线/分时", suite_detail_kline_minute),
        ("热榜/搜索/快讯", suite_hot_search_news),
        ("KOL/用户/财务", suite_kol_user_finance),
        ("自选(本地)", lambda b: suite_watchlist_local(b, a.mode)),
        ("登录", lambda b: suite_login(b, a.mode)),
        ("UI 状态", suite_ui),
        ("安全/健壮性", suite_security),
    ]
    print("==> dsh-xueqiu 功能矩阵  base=%s  mode=%s" % (a.base, a.mode))
    for name, fn in suites:
        print("-- %s" % name)
        fn(a.base)
    for st, msg in RESULTS:
        print("  %s %s" % ("✅" if st == "PASS" else "❌", msg))
    print("==> 结果: %d 通过, %d 失败 (mode=%s)" % (PASS, FAIL, a.mode))
    sys.exit(1 if FAIL else 0)


if __name__ == "__main__":
    main()
