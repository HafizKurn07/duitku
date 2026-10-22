(() => {
  var xi = Object.defineProperty;
  var bi = (t, e) => {
    for (var n in e) xi(t, n, { get: e[n], enumerable: !0 });
  };
  var Le = !1,
    Ne = !1,
    K = [],
    Pe = -1,
    oe = !1,
    en = !1;
  function wi(t) {
    ki(t);
  }
  function vi() {
    en = !0;
  }
  function Si() {
    ((en = !1), Hn());
  }
  function ki(t) {
    (K.includes(t) || (K.push(t), t._x_schedulerPriority !== void 0 && (oe = !0)), Hn());
  }
  function nn(t) {
    let e = K.indexOf(t);
    e !== -1 && e > Pe && K.splice(e, 1);
  }
  function Hn() {
    if (!Ne && !Le) {
      if (en) return;
      ((Le = !0), queueMicrotask(Ei));
    }
  }
  function Ei() {
    ((Le = !1), (Ne = !0));
    for (let t = 0; t < K.length; t++) (oe && Ai(t), K[t](), (Pe = t));
    ((K.length = 0), (Pe = -1), (oe = !1), (Ne = !1));
  }
  function Ai(t) {
    let e = new Map(),
      n = K.slice(t).sort((r, i) => Mi(r, i, e));
    for (let r = 0; r < n.length; r++) K[t + r] = n[r];
    oe = !1;
  }
  function Mi(t, e, n) {
    return Me(t)
      ? Me(e)
        ? Tn(t._x_schedulerPriority.el, n) - Tn(e._x_schedulerPriority.el, n) ||
          t._x_schedulerPriority.order - e._x_schedulerPriority.order
        : -1
      : Me(e)
        ? 1
        : 0;
  }
  function Me(t) {
    return t._x_schedulerPriority !== void 0;
  }
  function Tn(t, e) {
    if (e.has(t)) return e.get(t);
    let n = 0,
      r = t;
    for (; t;)
      (n++,
        t._x_teleportBack
          ? (t = t._x_teleportBack)
          : typeof ShadowRoot == "function" && t.parentNode instanceof ShadowRoot
            ? (t = t.parentNode.host)
            : (t = t.parentElement));
    return (e.set(r, n), n);
  }
  var wt,
    ft,
    vt,
    Wn,
    Oi = 0,
    Be = !0;
  function Ci(t) {
    ((Be = !1), t(), (Be = !0));
  }
  function Ti(t) {
    ((wt = t.reactive),
      (vt = t.release),
      (ft = (e) =>
        t.effect(e, {
          scheduler: (n) => {
            Be ? wi(n) : n();
          },
        })),
      (Wn = t.raw));
  }
  function In(t) {
    ft = t;
  }
  function Ii(t) {
    let e = () => {};
    return [
      (r, i) => {
        let a = (i == null ? void 0 : i.priority) === "structural" ? Oi++ : void 0,
          s = ft(r);
        return (
          a !== void 0 && s !== void 0 && (s._x_schedulerPriority = { el: t, order: a }),
          t._x_effects ||
            ((t._x_effects = new Set()),
            (t._x_runEffects = () => {
              t._x_effects.forEach((o) => o());
            })),
          t._x_effects.add(s),
          (e = () => {
            s !== void 0 && (t._x_effects.delete(s), vt(s));
          }),
          s
        );
      },
      () => {
        e();
      },
    ];
  }
  function Kn(t, e) {
    let n = !0,
      r,
      i,
      a = ft(() => {
        let s = t(),
          o = JSON.stringify(s);
        if (!n && (typeof s == "object" || s !== r)) {
          let u = typeof r == "object" ? JSON.parse(i) : r;
          queueMicrotask(() => {
            e(s, u);
          });
        }
        ((r = s), (i = o), (n = !1));
      });
    return () => {
      (nn(a), vt(a));
    };
  }
  async function Di(t) {
    vi();
    try {
      (await t(), await Promise.resolve());
    } finally {
      Si();
    }
  }
  var qn = [],
    Jn = [],
    zn = [];
  function $i(t) {
    zn.push(t);
  }
  function rn(t, e) {
    typeof e == "function"
      ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e))
      : ((e = t), Jn.push(e));
  }
  function Yn(t) {
    qn.push(t);
  }
  function Vn(t, e, n) {
    (t._x_attributeCleanups || (t._x_attributeCleanups = {}),
      t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []),
      t._x_attributeCleanups[e].push(n));
  }
  function Gn(t, e) {
    t._x_attributeCleanups &&
      Object.entries(t._x_attributeCleanups).forEach(([n, r]) => {
        (e === void 0 || e.includes(n)) &&
          (r.forEach((i) => i()), delete t._x_attributeCleanups[n]);
      });
  }
  function ji(t) {
    var e, n;
    for ((e = t._x_effects) == null || e.forEach(nn); (n = t._x_cleanups) != null && n.length;)
      t._x_cleanups.pop()();
  }
  var he = new MutationObserver(pe),
    an = !1;
  function sn() {
    (he.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }),
      (an = !0));
  }
  function Xn() {
    (Ri(), he.disconnect(), (an = !1));
  }
  var Q = [];
  function Ri() {
    let t = he.takeRecords();
    Q.push(() => t.length > 0 && pe(t));
    let e = Q.length;
    queueMicrotask(() => {
      if (Q.length === e) for (; Q.length > 0;) Q.shift()();
    });
  }
  function Li() {
    for (; Q.length > 0;) Q.shift()();
    let t = he.takeRecords();
    t.length > 0 && pe(t);
  }
  function v(t) {
    if (!an) return t();
    Xn();
    try {
      return t();
    } finally {
      sn();
    }
  }
  var on = !1,
    ue = [];
  function Ni() {
    on = !0;
  }
  function Pi() {
    ((on = !1), pe(ue), (ue = []));
  }
  function pe(t) {
    if (on) {
      ue = ue.concat(t);
      return;
    }
    let e = [],
      n = new Set(),
      r = new Map(),
      i = new Map();
    for (let a = 0; a < t.length; a++)
      if (
        !t[a].target._x_ignoreMutationObserver &&
        (t[a].type === "childList" &&
          (t[a].removedNodes.forEach((s) => {
            s.nodeType === 1 && s._x_marker && n.add(s);
          }),
          t[a].addedNodes.forEach((s) => {
            if (s.nodeType === 1) {
              if (n.has(s)) {
                n.delete(s);
                return;
              }
              s._x_marker || e.push(s);
            }
          })),
        t[a].type === "attributes")
      ) {
        let s = t[a].target,
          o = t[a].attributeName,
          u = t[a].oldValue,
          l = () => {
            (r.has(s) || r.set(s, []), r.get(s).push({ name: o, value: s.getAttribute(o) }));
          },
          d = () => {
            (i.has(s) || i.set(s, []), i.get(s).push(o));
          };
        s.hasAttribute(o) && u === null ? l() : s.hasAttribute(o) ? (d(), l()) : d();
      }
    (i.forEach((a, s) => {
      Gn(s, a);
    }),
      r.forEach((a, s) => {
        qn.forEach((o) => o(s, a));
      }));
    for (let a of n) e.some((s) => s.contains(a)) || Jn.forEach((s) => s(a));
    for (let a of e) a.isConnected && zn.forEach((s) => s(a));
    ((e = null), (n = null), (r = null), (i = null));
  }
  function Zn(t) {
    return at(it(t));
  }
  function qt(t, e, n) {
    return (
      (t._x_dataStack = [e, ...it(n || t)]),
      () => {
        t._x_dataStack = t._x_dataStack.filter((r) => r !== e);
      }
    );
  }
  function it(t) {
    return t._x_dataStack
      ? t._x_dataStack
      : typeof ShadowRoot == "function" && t instanceof ShadowRoot
        ? it(t.host)
        : t.parentNode
          ? it(t.parentNode)
          : [];
  }
  function at(t) {
    return new Proxy({ objects: t }, Bi);
  }
  function Qn(t, e) {
    return t === null || t === Object.prototype
      ? null
      : Object.prototype.hasOwnProperty.call(t, e)
        ? t
        : Qn(Object.getPrototypeOf(t), e);
  }
  var Bi = {
    ownKeys({ objects: t }) {
      return Array.from(new Set(t.flatMap((e) => Object.keys(e))));
    },
    has({ objects: t }, e) {
      return e == Symbol.unscopables
        ? !1
        : t.some((n) => Object.prototype.hasOwnProperty.call(n, e) || Reflect.has(n, e));
    },
    get({ objects: t }, e, n) {
      return e == "toJSON" ? Fi : Reflect.get(t.find((r) => Reflect.has(r, e)) || {}, e, n);
    },
    set({ objects: t }, e, n, r) {
      let i;
      for (let s of t) if (((i = Qn(s, e)), i)) break;
      i || (i = t[t.length - 1]);
      let a = Object.getOwnPropertyDescriptor(i, e);
      return a != null && a.set && a != null && a.get
        ? a.set.call(r, n) || !0
        : Reflect.set(i, e, n);
    },
  };
  function Fi() {
    return Reflect.ownKeys(this).reduce((e, n) => ((e[n] = Reflect.get(this, n)), e), {});
  }
  function un(t, e = () => {}) {
    let n = (i) => typeof i == "object" && !Array.isArray(i) && i !== null,
      r = (i, a = "") => {
        Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(
          ([s, { value: o, enumerable: u }]) => {
            if (u === !1 || o === void 0 || (typeof o == "object" && o !== null && o.__v_skip))
              return;
            let l = a === "" ? s : `${a}.${s}`;
            typeof o == "object" && o !== null && o._x_interceptor
              ? (i[s] = o.initialize(t, l, s, e))
              : n(o) && o !== i && !(o instanceof Element) && r(o, l);
          },
        );
      };
    return r(t);
  }
  function tr(t, e = () => {}) {
    let n = {
      initialValue: void 0,
      _x_interceptor: !0,
      initialize(r, i, a, s) {
        return t(
          this.initialValue,
          () => Ui(r, i),
          (o) => Fe(r, i, o),
          i,
          a,
          s,
        );
      },
    };
    return (
      e(n),
      (r) => {
        if (typeof r == "object" && r !== null && r._x_interceptor) {
          let i = n.initialize.bind(n);
          n.initialize = (a, s, o, u) => {
            let l = r.initialize(a, s, o, u);
            return ((n.initialValue = l), i(a, s, o, u));
          };
        } else n.initialValue = r;
        return n;
      }
    );
  }
  function Ui(t, e) {
    return e.split(".").reduce((n, r) => n[r], t);
  }
  function Fe(t, e, n) {
    if ((typeof e == "string" && (e = e.split(".")), e.length === 1)) t[e[0]] = n;
    else {
      if (e.length === 0) throw error;
      return (t[e[0]] || (t[e[0]] = {}), Fe(t[e[0]], e.slice(1), n));
    }
  }
  var er = {};
  function R(t, e) {
    er[t] = e;
  }
  function Pt(t, e) {
    let n = Hi(e);
    return (
      Object.entries(er).forEach(([r, i]) => {
        Object.defineProperty(t, `$${r}`, {
          get() {
            return i(e, n);
          },
          enumerable: !1,
        });
      }),
      t
    );
  }
  function Hi(t) {
    let [e, n] = ur(t),
      r = { interceptor: tr, ...e };
    return (rn(t, n), r);
  }
  function Wi(t, e, n, ...r) {
    try {
      return n(...r);
    } catch (i) {
      bt(i, t, e);
    }
  }
  function bt(...t) {
    return nr(...t);
  }
  var nr = qi;
  function Ki(t) {
    nr = t;
  }
  function qi(t, e, n = void 0) {
    ((t = Object.assign(t != null ? t : { message: "No error message given." }, {
      el: e,
      expression: n,
    })),
      console.warn(
        `Alpine Expression Error: ${t.message}

${
  n
    ? 'Expression: "' +
      n +
      `"

`
    : ""
}`,
        e,
      ),
      setTimeout(() => {
        throw t;
      }, 0));
  }
  var xt = !0;
  function rr(t) {
    let e = xt;
    xt = !1;
    let n = t();
    return ((xt = e), n);
  }
  function nt(t, e, n = {}) {
    let r;
    return (O(t, e)((i) => (r = i), n), r);
  }
  function O(...t) {
    return ir(...t);
  }
  var ir = () => {};
  function Ji(t) {
    ir = t;
  }
  var ar;
  function zi(t) {
    ar = t;
  }
  function Yi(t, e) {
    let n = {};
    Pt(n, t);
    let r = [n, ...it(t)],
      i = typeof e == "function" ? Vi(r, e) : Xi(r, e, t);
    return Wi.bind(null, t, e, i);
  }
  function Vi(t, e) {
    return (n = () => {}, { scope: r = {}, params: i = [], context: a } = {}) => {
      if (!xt) {
        Bt(n, e, at([r, ...t]), i);
        return;
      }
      let s = e.apply(at([r, ...t]), i);
      Bt(n, s);
    };
  }
  var Oe = {};
  function Gi(t, e) {
    if (Oe[t]) return Oe[t];
    let n = Object.getPrototypeOf(async function () {}).constructor,
      r =
        /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim())
          ? `(async()=>{ ${t} })()`
          : t,
      a = (() => {
        try {
          let s = new n(
            ["__self", "scope"],
            `with (scope) { __self.result = ${r} }; __self.finished = true; return __self.result;`,
          );
          return (Object.defineProperty(s, "name", { value: `[Alpine] ${t}` }), s);
        } catch (s) {
          return (bt(s, e, t), Promise.resolve());
        }
      })();
    return ((Oe[t] = a), a);
  }
  function Xi(t, e, n) {
    let r = Gi(e, n);
    return (i = () => {}, { scope: a = {}, params: s = [], context: o } = {}) => {
      ((r.result = void 0), (r.finished = !1));
      let u = at([a, ...t]);
      if (typeof r == "function") {
        let l = r.call(o, r, u).catch((d) => bt(d, n, e));
        r.finished
          ? (Bt(i, r.result, u, s, n), (r.result = void 0))
          : l
              .then((d) => {
                Bt(i, d, u, s, n);
              })
              .catch((d) => bt(d, n, e))
              .finally(() => (r.result = void 0));
      }
    };
  }
  function Bt(t, e, n, r, i) {
    if (xt && typeof e == "function") {
      let a = e.apply(n, r);
      a instanceof Promise ? a.then((s) => Bt(t, s, n, r)).catch((s) => bt(s, i, e)) : t(a);
    } else typeof e == "object" && e instanceof Promise ? e.then((a) => t(a)) : t(e);
  }
  function Zi(...t) {
    return ar(...t);
  }
  function Qi(t, e, n = {}) {
    var o, u;
    let r = {};
    Pt(r, t);
    let i = [r, ...it(t)],
      a = at([(o = n.scope) != null ? o : {}, ...i]),
      s = (u = n.params) != null ? u : [];
    if (e.includes("await")) {
      let l = Object.getPrototypeOf(async function () {}).constructor,
        d =
          /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim())
            ? `(async()=>{ ${e} })()`
            : e;
      return new l(["scope"], `with (scope) { let __result = ${d}; return __result }`).call(
        n.context,
        a,
      );
    } else {
      let l =
          /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim())
            ? `(()=>{ ${e} })()`
            : e,
        p = new Function(["scope"], `with (scope) { let __result = ${l}; return __result }`).call(
          n.context,
          a,
        );
      return typeof p == "function" && xt ? p.apply(a, s) : p;
    }
  }
  var ln = "x-";
  function St(t = "") {
    return ln + t;
  }
  function ta(t) {
    ln = t;
  }
  var le = {};
  function S(t, e) {
    return (
      (le[t] = e),
      {
        before(n) {
          if (!le[n]) {
            console.warn(
              String.raw`Cannot find directive \`${n}\`. \`${t}\` will use the default order of execution`,
            );
            return;
          }
          let r = et.indexOf(n);
          et.splice(r >= 0 ? r : et.indexOf("DEFAULT"), 0, t);
        },
      }
    );
  }
  function ea(t) {
    return Object.keys(le).includes(t);
  }
  function ge(t, e, n) {
    if (((e = Array.from(e)), t._x_virtualDirectives)) {
      let a = Object.entries(t._x_virtualDirectives).map(([o, u]) => ({ name: o, value: u })),
        s = sr(a);
      ((a = a.map((o) =>
        s.find((u) => u.name === o.name) ? { name: `x-bind:${o.name}`, value: `"${o.value}"` } : o,
      )),
        (e = e.concat(a)));
    }
    let r = {};
    return e
      .map(fr((a, s) => (r[a] = s)))
      .filter(hr)
      .map(ia(r, n))
      .sort(aa)
      .map((a) => ra(t, a));
  }
  function sr(t) {
    return Array.from(t)
      .map(fr())
      .filter((e) => !hr(e));
  }
  var Ue = !1,
    Dt = new Map(),
    or = Symbol();
  function na(t) {
    Ue = !0;
    let e = Symbol();
    ((or = e), Dt.set(e, []));
    let n = () => {
        for (; Dt.get(e).length;) Dt.get(e).shift()();
        Dt.delete(e);
      },
      r = () => {
        ((Ue = !1), n());
      };
    (t(n), r());
  }
  function ur(t) {
    let e = [],
      n = (o) => e.push(o),
      [r, i] = Ii(t);
    return (
      e.push(i),
      [
        {
          Alpine: kt,
          effect: r,
          cleanup: n,
          evaluateLater: O.bind(O, t),
          evaluate: nt.bind(nt, t),
        },
        () => e.forEach((o) => o()),
      ]
    );
  }
  function ra(t, e) {
    let n = () => {},
      r = le[e.type] || n,
      [i, a] = ur(t);
    Vn(t, e.original, a);
    let s = () => {
      t._x_ignore ||
        t._x_ignoreSelf ||
        (r.inline && r.inline(t, e, i), (r = r.bind(r, t, e, i)), Ue ? Dt.get(or).push(r) : r());
    };
    return ((s.runCleanups = a), s);
  }
  var lr =
      (t, e) =>
      ({ name: n, value: r }) => (n.startsWith(t) && (n = n.replace(t, e)), { name: n, value: r }),
    cr = (t) => t;
  function fr(t = () => {}) {
    return ({ name: e, value: n }) => {
      let { name: r, value: i } = dr.reduce((a, s) => s(a), { name: e, value: n });
      return (r !== e && t(r, e), { name: r, value: i });
    };
  }
  var dr = [];
  function cn(t) {
    dr.push(t);
  }
  function hr({ name: t }) {
    return pr().test(t);
  }
  var pr = () => new RegExp(`^${ln}([^:^.]+)\\b`);
  function ia(t, e) {
    return ({ name: n, value: r }) => {
      n === r && (r = "");
      let i = n.match(pr()),
        a = n.match(/:([a-zA-Z0-9\-_:]+)/),
        s = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [],
        o = e || t[n] || n;
      return {
        type: i ? i[1] : null,
        value: a ? a[1] : null,
        modifiers: s.map((u) => u.replace(".", "")),
        expression: r,
        original: o,
      };
    };
  }
  var He = "DEFAULT",
    et = [
      "ignore",
      "ref",
      "id",
      "data",
      "anchor",
      "bind",
      "init",
      "for",
      "model",
      "modelable",
      "transition",
      "show",
      "if",
      He,
      "teleport",
    ];
  function aa(t, e) {
    let n = et.indexOf(t.type) === -1 ? He : t.type,
      r = et.indexOf(e.type) === -1 ? He : e.type;
    return et.indexOf(n) - et.indexOf(r);
  }
  function st(t, e) {
    if (typeof ShadowRoot == "function" && t instanceof ShadowRoot) {
      Array.from(t.children).forEach((i) => st(i, e));
      return;
    }
    let n = !1;
    if ((e(t, () => (n = !0)), n)) return;
    let r = t.firstElementChild;
    for (; r;) (st(r, e, !1), (r = r.nextElementSibling));
  }
  var V = !1;
  function q(t, e = () => {}) {
    return (...n) => (V ? e(...n) : t(...n));
  }
  function sa(t) {
    return (...e) => V && t(...e);
  }
  var gr = [];
  function Jt(t) {
    gr.push(t);
  }
  function oa(t, e) {
    (gr.forEach((n) => n(t, e)),
      (V = !0),
      mr(() => {
        B(e, (n, r) => {
          r(n, () => {});
        });
      }),
      (V = !1));
  }
  var We = !1;
  function ua(t, e) {
    (e._x_dataStack || (e._x_dataStack = t._x_dataStack),
      (V = !0),
      (We = !0),
      mr(() => {
        la(e);
      }),
      (V = !1),
      (We = !1));
  }
  function la(t) {
    let e = !1;
    B(t, (r, i) => {
      st(r, (a, s) => {
        if (e && ga(a)) return s();
        ((e = !0), i(a, s));
      });
    });
  }
  function mr(t) {
    let e = ft;
    (In((n, r) => {
      let i = e(n);
      return (vt(i), () => {});
    }),
      t(),
      In(e));
  }
  var me = 0;
  function ca(t, e) {
    let n = t._x_deferInit;
    (n ||
      ((n = t._x_deferInit = { pending: 0, ownsIgnore: !t._x_ignore, queuedAttributes: new Map() }),
      n.ownsIgnore && (t._x_ignore = !0),
      me++),
      n.pending++,
      Promise.resolve(e)
        .catch((r) => {
          try {
            bt(r, t);
          } catch (i) {
            setTimeout(() => {
              throw i;
            }, 0);
          }
        })
        .then(() => fa(t, n)));
  }
  function fa(t, e) {
    (e.pending--,
      !(e.pending > 0) &&
        (Li(),
        !(e.pending > 0) &&
          t._x_deferInit === e &&
          (delete t._x_deferInit,
          e.ownsIgnore && delete t._x_ignore,
          me--,
          t.isConnected && (ha(e), B(t)))));
  }
  function da(t, e) {
    if (me === 0) return !1;
    let n = I(t, (r) => r._x_deferInit);
    return n
      ? (_r(
          n._x_deferInit,
          t,
          e.map(({ name: r }) => r),
        ),
        !0)
      : !1;
  }
  function _r(t, e, n) {
    let r = t.queuedAttributes.get(e);
    ((!r || r.marker !== e._x_marker) &&
      ((r = { marker: e._x_marker, names: new Set() }), t.queuedAttributes.set(e, r)),
      n.forEach((i) => r.names.add(i)));
  }
  function ha(t) {
    t.queuedAttributes.forEach((e, n) => {
      if (!n.isConnected || !n._x_marker || n._x_marker !== e.marker) return;
      let r = I(n, (a) => a._x_deferInit);
      if (r) {
        _r(r._x_deferInit, n, Array.from(e.names));
        return;
      }
      let i = Array.from(e.names)
        .filter((a) => n.hasAttribute(a))
        .map((a) => ({ name: a, value: n.getAttribute(a) }));
      i.length !== 0 && ge(n, i).forEach((a) => a());
    });
  }
  Jt((t, e) => {
    me !== 0 &&
      (!t ||
        t.nodeType !== 1 ||
        !e ||
        e.nodeType !== 1 ||
        (I(t, (n) => n._x_deferInit) && (e._x_ignore = !0)));
  });
  function $t(t, e, n = {}, r = {}) {
    return t.dispatchEvent(
      new CustomEvent(e, { detail: n, bubbles: !0, composed: !0, cancelable: !0, ...r }),
    );
  }
  function P(t, ...e) {
    console.warn(`Alpine Warning: ${t}`, ...e);
  }
  var Dn = !1;
  function pa() {
    (Dn &&
      P(
        "Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.",
      ),
      (Dn = !0),
      document.body ||
        P(
          "Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?",
        ),
      $t(document, "alpine:init"),
      $t(document, "alpine:initializing"),
      sn(),
      $i((e) => B(e, st)),
      rn((e) => dt(e)),
      Yn((e, n) => {
        da(e, n) || ge(e, n).forEach((r) => r());
      }));
    let t = (e) => !_e(e.parentElement, !0);
    (Array.from(document.querySelectorAll(br().join(",")))
      .filter(t)
      .forEach((e) => {
        B(e);
      }),
      $t(document, "alpine:initialized"),
      setTimeout(() => {
        ya();
      }));
  }
  var fn = [],
    yr = [];
  function xr() {
    return fn.map((t) => t());
  }
  function br() {
    return fn.concat(yr).map((t) => t());
  }
  function wr(t) {
    fn.push(t);
  }
  function vr(t) {
    yr.push(t);
  }
  function _e(t, e = !1) {
    return I(t, (n) => {
      if ((e ? br() : xr()).some((i) => n.matches(i))) return !0;
    });
  }
  function I(t, e) {
    if (t) {
      if (e(t)) return t;
      if (t._x_teleportBack) return I(t._x_teleportBack, e);
      if (t.parentNode instanceof ShadowRoot) return I(t.parentNode.host, e);
      if (t.parentElement) return I(t.parentElement, e);
    }
  }
  function ga(t) {
    return xr().some((e) => t.matches(e));
  }
  var Sr = [];
  function ma(t) {
    Sr.push(t);
  }
  var _a = 1;
  function B(t, e = st, n = () => {}) {
    I(t, (r) => r._x_ignore) ||
      na(() => {
        e(t, (r, i) => {
          r._x_marker ||
            (n(r, i),
            Sr.forEach((a) => a(r, i)),
            ge(r, r.attributes).forEach((a) => a()),
            r._x_ignore || (r._x_marker = _a++),
            r._x_ignore && i());
        });
      });
  }
  function dt(t, e = st) {
    e(t, (n) => {
      (ji(n), Gn(n), delete n._x_marker);
    });
  }
  function ya() {
    [
      ["ui", "dialog", ["[x-dialog], [x-popover]"]],
      ["anchor", "anchor", ["[x-anchor]"]],
      ["sort", "sort", ["[x-sort]"]],
    ].forEach(([e, n, r]) => {
      ea(n) ||
        r.some((i) => {
          if (document.querySelector(i)) return (P(`found "${i}", but missing ${e} plugin`), !0);
        });
    });
  }
  var Ke = [],
    dn = !1;
  function hn(t = () => {}) {
    return (
      queueMicrotask(() => {
        dn ||
          setTimeout(() => {
            qe();
          });
      }),
      new Promise((e) => {
        Ke.push(() => {
          (t(), e());
        });
      })
    );
  }
  function qe() {
    for (dn = !1; Ke.length;) Ke.shift()();
  }
  function xa() {
    dn = !0;
  }
  function pn(t, e) {
    return Array.isArray(e)
      ? $n(t, e.join(" "))
      : typeof e == "object" && e !== null
        ? ba(t, e)
        : typeof e == "function"
          ? pn(t, e())
          : $n(t, e);
  }
  function Je(t) {
    return t.split(/\s/).filter(Boolean);
  }
  function $n(t, e) {
    let n = (i) =>
        Je(i)
          .filter((a) => !t.classList.contains(a))
          .filter(Boolean),
      r = (i) => (
        t.classList.add(...i),
        () => {
          t.classList.remove(...i);
        }
      );
    return ((e = e === !0 ? (e = "") : e || ""), r(n(e)));
  }
  function ba(t, e) {
    let n = Object.entries(e)
        .flatMap(([s, o]) => (o ? Je(s) : !1))
        .filter(Boolean),
      r = Object.entries(e)
        .flatMap(([s, o]) => (o ? !1 : Je(s)))
        .filter(Boolean),
      i = [],
      a = [];
    return (
      r.forEach((s) => {
        t.classList.contains(s) && (t.classList.remove(s), a.push(s));
      }),
      n.forEach((s) => {
        t.classList.contains(s) || (t.classList.add(s), i.push(s));
      }),
      () => {
        (a.forEach((s) => t.classList.add(s)), i.forEach((s) => t.classList.remove(s)));
      }
    );
  }
  function ye(t, e) {
    return typeof e == "object" && e !== null ? wa(t, e) : va(t, e);
  }
  function wa(t, e) {
    let n = {};
    return (
      Object.entries(e).forEach(([r, i]) => {
        ((n[r] = t.style[r]), r.startsWith("--") || (r = Sa(r)), t.style.setProperty(r, i));
      }),
      setTimeout(() => {
        t.style.length === 0 && t.removeAttribute("style");
      }),
      () => {
        ye(t, n);
      }
    );
  }
  function va(t, e) {
    let n = t.getAttribute("style", e);
    return (
      t.setAttribute("style", e),
      () => {
        t.setAttribute("style", n || "");
      }
    );
  }
  function Sa(t) {
    return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  function ze(t, e = () => {}) {
    let n = !1;
    return function () {
      n ? e.apply(this, arguments) : ((n = !0), t.apply(this, arguments));
    };
  }
  S("transition", (t, { value: e, modifiers: n, expression: r }, { evaluate: i }) => {
    (typeof r == "function" && (r = i(r)),
      r !== !1 && (!r || typeof r == "boolean" ? Ea(t, n, e) : ka(t, r, e)));
  });
  function ka(t, e, n) {
    (kr(t, pn, ""),
      {
        enter: (i) => {
          t._x_transition.enter.during = i;
        },
        "enter-start": (i) => {
          t._x_transition.enter.start = i;
        },
        "enter-end": (i) => {
          t._x_transition.enter.end = i;
        },
        leave: (i) => {
          t._x_transition.leave.during = i;
        },
        "leave-start": (i) => {
          t._x_transition.leave.start = i;
        },
        "leave-end": (i) => {
          t._x_transition.leave.end = i;
        },
      }[n](e));
  }
  function Ea(t, e, n) {
    kr(t, ye);
    let r = !e.includes("in") && !e.includes("out") && !n,
      i = r || e.includes("in") || ["enter"].includes(n),
      a = r || e.includes("out") || ["leave"].includes(n);
    (e.includes("in") && !r && (e = e.filter((g, y) => y < e.indexOf("out"))),
      e.includes("out") && !r && (e = e.filter((g, y) => y > e.indexOf("out"))));
    let s = !e.includes("opacity") && !e.includes("scale"),
      o = s || e.includes("opacity"),
      u = s || e.includes("scale"),
      l = o ? 0 : 1,
      d = u ? Tt(e, "scale", 95) / 100 : 1,
      p = Tt(e, "delay", 0) / 1e3,
      m = Tt(e, "origin", "center"),
      h = "opacity, transform",
      _ = Tt(e, "duration", 150) / 1e3,
      f = Tt(e, "duration", 75) / 1e3,
      c = "cubic-bezier(0.4, 0.0, 0.2, 1)";
    (i &&
      ((t._x_transition.enter.during = {
        transformOrigin: m,
        transitionDelay: `${p}s`,
        transitionProperty: h,
        transitionDuration: `${_}s`,
        transitionTimingFunction: c,
      }),
      (t._x_transition.enter.start = { opacity: l, transform: `scale(${d})` }),
      (t._x_transition.enter.end = { opacity: 1, transform: "scale(1)" })),
      a &&
        ((t._x_transition.leave.during = {
          transformOrigin: m,
          transitionDelay: `${p}s`,
          transitionProperty: h,
          transitionDuration: `${f}s`,
          transitionTimingFunction: c,
        }),
        (t._x_transition.leave.start = { opacity: 1, transform: "scale(1)" }),
        (t._x_transition.leave.end = { opacity: l, transform: `scale(${d})` })));
  }
  function kr(t, e, n = {}) {
    t._x_transition ||
      (t._x_transition = {
        enter: { during: n, start: n, end: n },
        leave: { during: n, start: n, end: n },
        in(r = () => {}, i = () => {}) {
          Ye(
            t,
            e,
            { during: this.enter.during, start: this.enter.start, end: this.enter.end },
            r,
            i,
          );
        },
        out(r = () => {}, i = () => {}) {
          Ye(
            t,
            e,
            { during: this.leave.during, start: this.leave.start, end: this.leave.end },
            r,
            i,
          );
        },
      });
  }
  window.Element.prototype._x_toggleAndCascadeWithTransitions = function (t, e, n, r) {
    let i = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout,
      a = () => i(n);
    if (e) {
      t._x_transition && (t._x_transition.enter || t._x_transition.leave)
        ? t._x_transition.enter &&
          (Object.entries(t._x_transition.enter.during).length ||
            Object.entries(t._x_transition.enter.start).length ||
            Object.entries(t._x_transition.enter.end).length)
          ? t._x_transition.in(n)
          : a()
        : t._x_transition
          ? t._x_transition.in(n)
          : a();
      return;
    }
    ((t._x_hidePromise = t._x_transition
      ? new Promise((s, o) => {
          (t._x_transition.out(
            () => {},
            () => s(r),
          ),
            t._x_transitioning &&
              t._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 })));
        })
      : Promise.resolve(r)),
      queueMicrotask(() => {
        let s = Er(t);
        s
          ? (s._x_hideChildren || (s._x_hideChildren = []), s._x_hideChildren.push(t))
          : i(() => {
              let o = (u) => {
                let l = Promise.all([u._x_hidePromise, ...(u._x_hideChildren || []).map(o)]).then(
                  ([d]) => (d == null ? void 0 : d()),
                );
                return (delete u._x_hidePromise, delete u._x_hideChildren, l);
              };
              o(t).catch((u) => {
                if (!u.isFromCancelledTransition) throw u;
              });
            });
      }));
  };
  function Er(t) {
    let e = t.parentNode;
    if (e) return e._x_hidePromise ? e : Er(e);
  }
  function Ye(t, e, { during: n, start: r, end: i } = {}, a = () => {}, s = () => {}) {
    if (
      (t._x_transitioning && t._x_transitioning.cancel(),
      Object.keys(n).length === 0 && Object.keys(r).length === 0 && Object.keys(i).length === 0)
    ) {
      (a(), s());
      return;
    }
    let o, u, l;
    Aa(t, {
      start() {
        o = e(t, r);
      },
      during() {
        u = e(t, n);
      },
      before: a,
      end() {
        (o(), (l = e(t, i)));
      },
      after: s,
      cleanup() {
        (u(), l());
      },
    });
  }
  function Aa(t, e) {
    let n,
      r,
      i,
      a = ze(() => {
        v(() => {
          ((n = !0),
            r || e.before(),
            i || (e.end(), qe()),
            e.after(),
            t.isConnected && e.cleanup(),
            delete t._x_transitioning);
        });
      });
    ((t._x_transitioning = {
      beforeCancels: [],
      beforeCancel(s) {
        this.beforeCancels.push(s);
      },
      cancel: ze(function () {
        for (; this.beforeCancels.length;) this.beforeCancels.shift()();
        a();
      }),
      finish: a,
    }),
      v(() => {
        (e.start(), e.during());
      }),
      xa(),
      requestAnimationFrame(() => {
        if (n) return;
        let s =
            Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")) *
            1e3,
          o = Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
        (s === 0 && (s = Number(getComputedStyle(t).animationDuration.replace("s", "")) * 1e3),
          v(() => {
            e.before();
          }),
          (r = !0),
          requestAnimationFrame(() => {
            n ||
              (v(() => {
                e.end();
              }),
              qe(),
              setTimeout(t._x_transitioning.finish, s + o),
              (i = !0));
          }));
      }));
  }
  function Tt(t, e, n) {
    if (t.indexOf(e) === -1) return n;
    let r = t[t.indexOf(e) + 1];
    if (!r || (e === "scale" && isNaN(r))) return n;
    if (e === "duration" || e === "delay") {
      let i = r.match(/([0-9]+)ms/);
      if (i) return i[1];
    }
    return e === "origin" &&
      ["top", "right", "left", "center", "bottom"].includes(t[t.indexOf(e) + 2])
      ? [r, t[t.indexOf(e) + 2]].join(" ")
      : r;
  }
  function Ar(t, e, n, r = []) {
    switch (
      (t._x_bindings || (t._x_bindings = wt({})),
      (t._x_bindings[e] = n),
      (e = r.includes("camel") ? ja(e) : e),
      e)
    ) {
      case "value":
        Ma(t, n);
        break;
      case "style":
        Ca(t, n);
        break;
      case "class":
        Oa(t, n);
        break;
      case "selected":
      case "checked":
        Ta(t, e, n);
        break;
      default:
        gn(t, e, n);
        break;
    }
  }
  function Ma(t, e) {
    if (mn(t)) t.attributes.value === void 0 && (t.value = e);
    else if (ce(t))
      Number.isInteger(e)
        ? (t.value = e)
        : !Array.isArray(e) && typeof e != "boolean" && ![null, void 0].includes(e)
          ? (t.value = String(e))
          : Array.isArray(e)
            ? (t.checked = e.some((n) => Ra(n, t.value)))
            : (t.checked = !!e);
    else if (t.tagName === "SELECT") $a(t, e);
    else if (t.tagName === "OPTION") gn(t, "value", e);
    else {
      if (t.value === e && (typeof e != "object" || e === null)) return;
      t.value = e === void 0 ? "" : e;
    }
  }
  function Oa(t, e) {
    (t._x_undoAddedClasses && t._x_undoAddedClasses(), (t._x_undoAddedClasses = pn(t, e)));
  }
  function Ca(t, e) {
    (t._x_undoAddedStyles && t._x_undoAddedStyles(), (t._x_undoAddedStyles = ye(t, e)));
  }
  function Ta(t, e, n) {
    (gn(t, e, n), Da(t, e, n));
  }
  function gn(t, e, n) {
    [null, void 0, !1].includes(n) && Na(e)
      ? t.removeAttribute(e)
      : (Mr(e) && (n = e), Pa(n) && (n = JSON.stringify(n)), Ia(t, e, n));
  }
  function Ia(t, e, n) {
    t.getAttribute(e) != n && t.setAttribute(e, n);
  }
  function Da(t, e, n) {
    t[e] !== n && (t[e] = n);
  }
  function $a(t, e) {
    let n = [].concat(e).map((r) => r + "");
    Array.from(t.options).forEach((r) => {
      r.selected = n.includes(r.value);
    });
  }
  function ja(t) {
    return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
  }
  function Ra(t, e) {
    return t == e;
  }
  function se(t) {
    return [1, "1", "true", "on", "yes", !0].includes(t)
      ? !0
      : [0, "0", "false", "off", "no", !1].includes(t)
        ? !1
        : t
          ? !!t
          : null;
  }
  var La = new Set([
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected",
    "shadowrootclonable",
    "shadowrootdelegatesfocus",
    "shadowrootserializable",
  ]);
  function Mr(t) {
    return La.has(t);
  }
  function Na(t) {
    return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t);
  }
  function Pa(t) {
    return typeof t == "object" && t !== null;
  }
  function Ba(t, e, n) {
    return t._x_bindings && t._x_bindings[e] !== void 0 ? t._x_bindings[e] : Or(t, e, n);
  }
  function Fa(t, e, n, r = !0) {
    if (t._x_bindings && t._x_bindings[e] !== void 0) return t._x_bindings[e];
    if (t._x_inlineBindings && t._x_inlineBindings[e] !== void 0) {
      let i = t._x_inlineBindings[e];
      return ((i.extract = r), rr(() => nt(t, i.expression)));
    }
    return Or(t, e, n);
  }
  function Or(t, e, n) {
    let r = t.getAttribute(e);
    return r === null
      ? typeof n == "function"
        ? n()
        : n
      : r === ""
        ? !0
        : Mr(e)
          ? !![e, "true"].includes(r)
          : r;
  }
  function ce(t) {
    return t.type === "checkbox" || t.localName === "ui-checkbox" || t.localName === "ui-switch";
  }
  function mn(t) {
    return t.type === "radio" || t.localName === "ui-radio";
  }
  function Cr(t, e) {
    let n;
    return function () {
      let r = this,
        i = arguments,
        a = function () {
          ((n = null), t.apply(r, i));
        };
      (clearTimeout(n), (n = setTimeout(a, e)));
    };
  }
  function Tr(t, e) {
    let n;
    return function () {
      let r = this,
        i = arguments;
      n || (t.apply(r, i), (n = !0), setTimeout(() => (n = !1), e));
    };
  }
  function Ir({ get: t, set: e }, { get: n, set: r }) {
    let i = !0,
      a,
      s,
      o = ft(() => {
        let u = t(),
          l = n();
        if (i) (r(Ce(u)), (i = !1));
        else {
          let d = JSON.stringify(u),
            p = JSON.stringify(l);
          d !== a ? r(Ce(u)) : d !== p && e(Ce(l));
        }
        ((a = JSON.stringify(t())), (s = JSON.stringify(n())));
      });
    return () => {
      (nn(o), vt(o));
    };
  }
  function Ce(t) {
    return typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
  }
  function Ua(t) {
    (Array.isArray(t) ? t : [t]).forEach((n) => n(kt));
  }
  var W = {},
    jn = !1;
  function Ha(t, e) {
    if ((jn || ((W = wt(W)), (jn = !0)), e === void 0)) return W[t];
    ((W[t] = e),
      typeof e == "object" && e !== null && e._x_interceptor
        ? (W[t] = e.initialize(W, t, t, () => {}))
        : un(W[t]),
      typeof e == "object" &&
        e !== null &&
        e.hasOwnProperty("init") &&
        typeof e.init == "function" &&
        W[t].init());
  }
  function Wa() {
    return W;
  }
  var Dr = {};
  function Ka(t, e) {
    let n = typeof e != "function" ? () => e : e;
    return t instanceof Element ? $r(t, n()) : ((Dr[t] = n), () => {});
  }
  function qa(t) {
    return (
      Object.entries(Dr).forEach(([e, n]) => {
        Object.defineProperty(t, e, {
          get() {
            return (...r) => n(...r);
          },
        });
      }),
      t
    );
  }
  function $r(t, e, n) {
    let r = [];
    for (; r.length;) r.pop()();
    let i = Object.entries(e).map(([s, o]) => ({ name: s, value: o })),
      a = sr(i);
    return (
      (i = i.map((s) =>
        a.find((o) => o.name === s.name) ? { name: `x-bind:${s.name}`, value: `"${s.value}"` } : s,
      )),
      ge(t, i, n).map((s) => {
        (r.push(s.runCleanups), s());
      }),
      () => {
        for (; r.length;) r.pop()();
      }
    );
  }
  var jr = {};
  function Ja(t, e) {
    jr[t] = e;
  }
  function za(t, e) {
    return (
      Object.entries(jr).forEach(([n, r]) => {
        Object.defineProperty(t, n, {
          get() {
            return (...i) => r.bind(e)(...i);
          },
          enumerable: !1,
        });
      }),
      t
    );
  }
  var Ya = {
      get reactive() {
        return wt;
      },
      get release() {
        return vt;
      },
      get effect() {
        return ft;
      },
      get raw() {
        return Wn;
      },
      get transaction() {
        return Di;
      },
      version: "3.17.4",
      flushAndStopDeferringMutations: Pi,
      dontAutoEvaluateFunctions: rr,
      disableEffectScheduling: Ci,
      startObservingMutations: sn,
      stopObservingMutations: Xn,
      setReactivityEngine: Ti,
      onAttributeRemoved: Vn,
      onAttributesAdded: Yn,
      closestDataStack: it,
      skipDuringClone: q,
      onlyDuringClone: sa,
      addRootSelector: wr,
      addInitSelector: vr,
      setErrorHandler: Ki,
      interceptClone: Jt,
      addScopeToNode: qt,
      deferMutations: Ni,
      mapAttributes: cn,
      evaluateLater: O,
      interceptInit: ma,
      initInterceptors: un,
      injectMagics: Pt,
      setEvaluator: Ji,
      setRawEvaluator: zi,
      mergeProxies: at,
      extractProp: Fa,
      findClosest: I,
      onElRemoved: rn,
      closestRoot: _e,
      destroyTree: dt,
      interceptor: tr,
      transition: Ye,
      setStyles: ye,
      mutateDom: v,
      deferInit: ca,
      directive: S,
      entangle: Ir,
      throttle: Tr,
      debounce: Cr,
      evaluate: nt,
      evaluateRaw: Zi,
      initTree: B,
      nextTick: hn,
      prefixed: St,
      prefix: ta,
      plugin: Ua,
      magic: R,
      store: Ha,
      start: pa,
      clone: ua,
      cloneNode: oa,
      bound: Ba,
      $data: Zn,
      watch: Kn,
      walk: st,
      data: Ja,
      bind: Ka,
    },
    kt = Ya;
  function Rr(t) {
    let e = Object.create(null);
    for (let n of t.split(",")) e[n] = 1;
    return (n) => n in e;
  }
  var uo = Object.freeze({}),
    lo = Object.freeze([]),
    Ft = Object.assign,
    Va = Object.prototype.hasOwnProperty,
    Ve = (t, e) => Va.call(t, e),
    Ut = Array.isArray,
    jt = (t) => Lr(t) === "[object Map]",
    Ga = (t) => typeof t == "string",
    zt = (t) => typeof t == "symbol",
    Ht = (t) => t !== null && typeof t == "object",
    Xa = Object.prototype.toString,
    Lr = (t) => Xa.call(t),
    Nr = (t) => Lr(t).slice(8, -1),
    _n = (t) => Ga(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t,
    xe = (t) => {
      let e = Object.create(null);
      return (n) => e[n] || (e[n] = t(n));
    },
    Za = /-\w/g,
    co = xe((t) => t.replace(Za, (e) => e.slice(1).toUpperCase())),
    Qa = /\B([A-Z])/g,
    fo = xe((t) => t.replace(Qa, "-$1").toLowerCase()),
    Pr = xe((t) => t.charAt(0).toUpperCase() + t.slice(1)),
    ho = xe((t) => (t ? `on${Pr(t)}` : "")),
    tt = (t, e) => !Object.is(t, e),
    ts = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
    po = Rr(
      ts +
        ",async,autofocus,autoplay,controls,default,defer,disabled,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected",
    );
  function ot(t, ...e) {
    console.warn(`[Vue warn] ${t}`, ...e);
  }
  var Te,
    x,
    Ie = new WeakSet(),
    Rn = class {
      constructor(t) {
        ((this.fn = t),
          (this.deps = void 0),
          (this.depsTail = void 0),
          (this.flags = 5),
          (this.next = void 0),
          (this.cleanup = void 0),
          (this.scheduler = void 0),
          Te && (Te.active ? Te.effects.push(this) : (this.flags &= -2)));
      }
      pause() {
        this.flags |= 64;
      }
      resume() {
        this.flags & 64 && ((this.flags &= -65), Ie.has(this) && (Ie.delete(this), this.trigger()));
      }
      notify() {
        (this.flags & 2 && !(this.flags & 32)) || this.flags & 8 || es(this);
      }
      run() {
        if (!(this.flags & 1)) return this.fn();
        ((this.flags |= 2), Ln(this), Fr(this));
        let t = x,
          e = j;
        ((x = this), (j = !0));
        try {
          return this.fn();
        } finally {
          (x !== this &&
            ot("Active effect was not restored correctly - this is likely a Vue internal bug."),
            Ur(this),
            (x = t),
            (j = e),
            (this.flags &= -3));
        }
      }
      stop() {
        if (this.flags & 1) {
          for (let t = this.deps; t; t = t.nextDep) bn(t);
          ((this.deps = this.depsTail = void 0),
            Ln(this),
            this.onStop && this.onStop(),
            (this.flags &= -2));
        }
      }
      trigger() {
        this.flags & 64 ? Ie.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
      }
      runIfDirty() {
        Ge(this) && this.run();
      }
      get dirty() {
        return Ge(this);
      }
    },
    Br = 0,
    Rt,
    Lt;
  function es(t, e = !1) {
    if (((t.flags |= 8), e)) {
      ((t.next = Lt), (Lt = t));
      return;
    }
    ((t.next = Rt), (Rt = t));
  }
  function yn() {
    Br++;
  }
  function xn() {
    if (--Br > 0) return;
    if (Lt) {
      let e = Lt;
      for (Lt = void 0; e;) {
        let n = e.next;
        ((e.next = void 0), (e.flags &= -9), (e = n));
      }
    }
    let t;
    for (; Rt;) {
      let e = Rt;
      for (Rt = void 0; e;) {
        let n = e.next;
        if (((e.next = void 0), (e.flags &= -9), e.flags & 1))
          try {
            e.trigger();
          } catch (r) {
            t || (t = r);
          }
        e = n;
      }
    }
    if (t) throw t;
  }
  function Fr(t) {
    for (let e = t.deps; e; e = e.nextDep)
      ((e.version = -1), (e.prevActiveLink = e.dep.activeLink), (e.dep.activeLink = e));
  }
  function Ur(t) {
    let e,
      n = t.depsTail,
      r = n;
    for (; r;) {
      let i = r.prevDep;
      (r.version === -1 ? (r === n && (n = i), bn(r), rs(r)) : (e = r),
        (r.dep.activeLink = r.prevActiveLink),
        (r.prevActiveLink = void 0),
        (r = i));
    }
    ((t.deps = e), (t.depsTail = n));
  }
  function Ge(t) {
    for (let e = t.deps; e; e = e.nextDep)
      if (
        e.dep.version !== e.version ||
        (e.dep.computed && (ns(e.dep.computed) || e.dep.version !== e.version))
      )
        return !0;
    return !!t._dirty;
  }
  function ns(t) {
    if (
      (t.flags & 4 && !(t.flags & 16)) ||
      ((t.flags &= -17), t.globalVersion === fe) ||
      ((t.globalVersion = fe), !t.isSSR && t.flags & 128 && ((!t.deps && !t._dirty) || !Ge(t)))
    )
      return;
    t.flags |= 2;
    let e = t.dep,
      n = x,
      r = j;
    ((x = t), (j = !0));
    try {
      Fr(t);
      let i = t.fn(t._value);
      (e.version === 0 || tt(i, t._value)) && ((t.flags |= 128), (t._value = i), e.version++);
    } catch (i) {
      throw (e.version++, i);
    } finally {
      ((x = n), (j = r), Ur(t), (t.flags &= -3));
    }
  }
  function bn(t, e = !1) {
    let { dep: n, prevSub: r, nextSub: i } = t;
    if (
      (r && ((r.nextSub = i), (t.prevSub = void 0)),
      i && ((i.prevSub = r), (t.nextSub = void 0)),
      n.subsHead === t && (n.subsHead = i),
      n.subs === t && ((n.subs = r), !r && n.computed))
    ) {
      n.computed.flags &= -5;
      for (let a = n.computed.deps; a; a = a.nextDep) bn(a, !0);
    }
    !e && !--n.sc && n.map && n.map.delete(n.key);
  }
  function rs(t) {
    let { prevDep: e, nextDep: n } = t;
    (e && ((e.nextDep = n), (t.prevDep = void 0)), n && ((n.prevDep = e), (t.nextDep = void 0)));
  }
  function is(t, e) {
    t.effect instanceof Rn && (t = t.effect.fn);
    let n = new Rn(t);
    e && Ft(n, e);
    try {
      n.run();
    } catch (i) {
      throw (n.stop(), i);
    }
    let r = n.run.bind(n);
    return ((r.effect = n), r);
  }
  function as(t) {
    t.effect.stop();
  }
  var j = !0,
    Hr = [];
  function ss() {
    (Hr.push(j), (j = !1));
  }
  function os() {
    let t = Hr.pop();
    j = t === void 0 ? !0 : t;
  }
  function Ln(t) {
    let { cleanup: e } = t;
    if (((t.cleanup = void 0), e)) {
      let n = x;
      x = void 0;
      try {
        e();
      } finally {
        x = n;
      }
    }
  }
  var fe = 0,
    us = class {
      constructor(t, e) {
        ((this.sub = t),
          (this.dep = e),
          (this.version = e.version),
          (this.nextDep =
            this.prevDep =
            this.nextSub =
            this.prevSub =
            this.prevActiveLink =
              void 0));
      }
    },
    ls = class {
      constructor(t) {
        ((this.computed = t),
          (this.version = 0),
          (this.activeLink = void 0),
          (this.subs = void 0),
          (this.map = void 0),
          (this.key = void 0),
          (this.sc = 0),
          (this.__v_skip = !0),
          (this.subsHead = void 0));
      }
      track(t) {
        if (!x || !j || x === this.computed) return;
        let e = this.activeLink;
        if (e === void 0 || e.sub !== x)
          ((e = this.activeLink = new us(x, this)),
            x.deps
              ? ((e.prevDep = x.depsTail), (x.depsTail.nextDep = e), (x.depsTail = e))
              : (x.deps = x.depsTail = e),
            Wr(e));
        else if (e.version === -1 && ((e.version = this.version), e.nextDep)) {
          let n = e.nextDep;
          ((n.prevDep = e.prevDep),
            e.prevDep && (e.prevDep.nextDep = n),
            (e.prevDep = x.depsTail),
            (e.nextDep = void 0),
            (x.depsTail.nextDep = e),
            (x.depsTail = e),
            x.deps === e && (x.deps = n));
        }
        return (x.onTrack && x.onTrack(Ft({ effect: x }, t)), e);
      }
      trigger(t) {
        (this.version++, fe++, this.notify(t));
      }
      notify(t) {
        yn();
        try {
          for (let e = this.subsHead; e; e = e.nextSub)
            e.sub.onTrigger && !(e.sub.flags & 8) && e.sub.onTrigger(Ft({ effect: e.sub }, t));
          for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
        } finally {
          xn();
        }
      }
    };
  function Wr(t) {
    if ((t.dep.sc++, t.sub.flags & 4)) {
      let e = t.dep.computed;
      if (e && !t.dep.subs) {
        e.flags |= 20;
        for (let r = e.deps; r; r = r.nextDep) Wr(r);
      }
      let n = t.dep.subs;
      (n !== t && ((t.prevSub = n), n && (n.nextSub = t)),
        t.dep.subsHead === void 0 && (t.dep.subsHead = t),
        (t.dep.subs = t));
    }
  }
  var Xe = new WeakMap(),
    rt = Symbol("Object iterate"),
    Ze = Symbol("Map keys iterate"),
    Wt = Symbol("Array iterate");
  function T(t, e, n) {
    if (j && x) {
      let r = Xe.get(t);
      r || Xe.set(t, (r = new Map()));
      let i = r.get(n);
      (i || (r.set(n, (i = new ls())), (i.map = r), (i.key = n)),
        i.track({ target: t, type: e, key: n }));
    }
  }
  function Y(t, e, n, r, i, a) {
    let s = Xe.get(t);
    if (!s) {
      fe++;
      return;
    }
    let o = (u) => {
      u && u.trigger({ target: t, type: e, key: n, newValue: r, oldValue: i, oldTarget: a });
    };
    if ((yn(), e === "clear")) s.forEach(o);
    else {
      let u = Ut(t),
        l = u && _n(n);
      if (u && n === "length") {
        let d = Number(r);
        s.forEach((p, m) => {
          (m === "length" || m === Wt || (!zt(m) && m >= d)) && o(p);
        });
      } else
        switch (((n !== void 0 || s.has(void 0)) && o(s.get(n)), l && o(s.get(Wt)), e)) {
          case "add":
            u ? l && o(s.get("length")) : (o(s.get(rt)), jt(t) && o(s.get(Ze)));
            break;
          case "delete":
            u || (o(s.get(rt)), jt(t) && o(s.get(Ze)));
            break;
          case "set":
            jt(t) && o(s.get(rt));
            break;
        }
    }
    xn();
  }
  function _t(t) {
    let e = b(t);
    return e === t ? e : (T(e, "iterate", Wt), lt(t) ? e : e.map(ct));
  }
  function wn(t) {
    return (T((t = b(t)), "iterate", Wt), t);
  }
  function N(t, e) {
    return ut(t) ? (Gr(t) ? Kt(ct(e)) : Kt(e)) : ct(e);
  }
  var cs = {
    __proto__: null,
    [Symbol.iterator]() {
      return De(this, Symbol.iterator, (t) => N(this, t));
    },
    concat(...t) {
      return _t(this).concat(...t.map((e) => (Ut(e) ? _t(e) : e)));
    },
    entries() {
      return De(this, "entries", (t) => ((t[1] = N(this, t[1])), t));
    },
    every(t, e) {
      return H(this, "every", t, e, void 0, arguments);
    },
    filter(t, e) {
      return H(this, "filter", t, e, (n) => n.map((r) => N(this, r)), arguments);
    },
    find(t, e) {
      return H(this, "find", t, e, (n) => N(this, n), arguments);
    },
    findIndex(t, e) {
      return H(this, "findIndex", t, e, void 0, arguments);
    },
    findLast(t, e) {
      return H(this, "findLast", t, e, (n) => N(this, n), arguments);
    },
    findLastIndex(t, e) {
      return H(this, "findLastIndex", t, e, void 0, arguments);
    },
    forEach(t, e) {
      return H(this, "forEach", t, e, void 0, arguments);
    },
    includes(...t) {
      return $e(this, "includes", t);
    },
    indexOf(...t) {
      return $e(this, "indexOf", t);
    },
    join(t) {
      return _t(this).join(t);
    },
    lastIndexOf(...t) {
      return $e(this, "lastIndexOf", t);
    },
    map(t, e) {
      return H(this, "map", t, e, void 0, arguments);
    },
    pop() {
      return It(this, "pop");
    },
    push(...t) {
      return It(this, "push", t);
    },
    reduce(t, ...e) {
      return Nn(this, "reduce", t, e);
    },
    reduceRight(t, ...e) {
      return Nn(this, "reduceRight", t, e);
    },
    shift() {
      return It(this, "shift");
    },
    some(t, e) {
      return H(this, "some", t, e, void 0, arguments);
    },
    splice(...t) {
      return It(this, "splice", t);
    },
    toReversed() {
      return _t(this).toReversed();
    },
    toSorted(t) {
      return _t(this).toSorted(t);
    },
    toSpliced(...t) {
      return _t(this).toSpliced(...t);
    },
    unshift(...t) {
      return It(this, "unshift", t);
    },
    values() {
      return De(this, "values", (t) => N(this, t));
    },
  };
  function De(t, e, n) {
    let r = wn(t),
      i = r[e]();
    return (
      r !== t &&
        !lt(t) &&
        ((i._next = i.next),
        (i.next = () => {
          let a = i._next();
          return (a.done || (a.value = n(a.value)), a);
        })),
      i
    );
  }
  var fs = Array.prototype;
  function H(t, e, n, r, i, a) {
    let s = wn(t),
      o = s !== t && !lt(t),
      u = s[e];
    if (u !== fs[e]) {
      let p = u.apply(t, a);
      return o ? ct(p) : p;
    }
    let l = n;
    s !== t &&
      (o
        ? (l = function (p, m) {
            return n.call(this, N(t, p), m, t);
          })
        : n.length > 2 &&
          (l = function (p, m) {
            return n.call(this, p, m, t);
          }));
    let d = u.call(s, l, r);
    return o && i ? i(d) : d;
  }
  function Nn(t, e, n, r) {
    let i = wn(t),
      a = i !== t && !lt(t),
      s = n,
      o = !1;
    i !== t &&
      (a
        ? ((o = r.length === 0),
          (s = function (l, d, p) {
            return (o && ((o = !1), (l = N(t, l))), n.call(this, l, N(t, d), p, t));
          }))
        : n.length > 3 &&
          (s = function (l, d, p) {
            return n.call(this, l, d, p, t);
          }));
    let u = i[e](s, ...r);
    return o ? N(t, u) : u;
  }
  function $e(t, e, n) {
    let r = b(t);
    T(r, "iterate", Wt);
    let i = r[e](...n);
    return (i === -1 || i === !1) && Es(n[0]) ? ((n[0] = b(n[0])), r[e](...n)) : i;
  }
  function It(t, e, n = []) {
    (ss(), yn());
    let r = b(t)[e].apply(t, n);
    return (xn(), os(), r);
  }
  var ds = Rr("__proto__,__v_isRef,__isVue"),
    Kr = new Set(
      Object.getOwnPropertyNames(Symbol)
        .filter((t) => t !== "arguments" && t !== "caller")
        .map((t) => Symbol[t])
        .filter(zt),
    );
  function hs(t) {
    zt(t) || (t = String(t));
    let e = b(this);
    return (T(e, "has", t), e.hasOwnProperty(t));
  }
  var qr = class {
      constructor(t = !1, e = !1) {
        ((this._isReadonly = t), (this._isShallow = e));
      }
      get(t, e, n) {
        if (e === "__v_skip") return t.__v_skip;
        let r = this._isReadonly,
          i = this._isShallow;
        if (e === "__v_isReactive") return !r;
        if (e === "__v_isReadonly") return r;
        if (e === "__v_isShallow") return i;
        if (e === "__v_raw")
          return n === (r ? (i ? Ss : Yr) : i ? vs : zr).get(t) ||
            Object.getPrototypeOf(t) === Object.getPrototypeOf(n)
            ? t
            : void 0;
        let a = Ut(t);
        if (!r) {
          let o;
          if (a && (o = cs[e])) return o;
          if (e === "hasOwnProperty") return hs;
        }
        let s = Reflect.get(t, e, Nt(t) ? t : n);
        if ((zt(e) ? Kr.has(e) : ds(e)) || (r || T(t, "get", e), i)) return s;
        if (Nt(s)) {
          let o = a && _n(e) ? s : s.value;
          return r && Ht(o) ? tn(o) : o;
        }
        return Ht(s) ? (r ? tn(s) : vn(s)) : s;
      }
    },
    ps = class extends qr {
      constructor(t = !1) {
        super(!1, t);
      }
      set(t, e, n, r) {
        let i = t[e],
          a = Ut(t) && _n(e);
        if (!this._isShallow) {
          let u = ut(i);
          if ((!lt(n) && !ut(n) && ((i = b(i)), (n = b(n))), !a && Nt(i) && !Nt(n)))
            return u
              ? (ot(`Set operation on key "${String(e)}" failed: target is readonly.`, t[e]), !0)
              : ((i.value = n), !0);
        }
        let s = a ? Number(e) < t.length : Ve(t, e),
          o = Reflect.set(t, e, n, Nt(t) ? t : r);
        return (t === b(r) && o && (s ? tt(n, i) && Y(t, "set", e, n, i) : Y(t, "add", e, n)), o);
      }
      deleteProperty(t, e) {
        let n = Ve(t, e),
          r = t[e],
          i = Reflect.deleteProperty(t, e);
        return (i && n && Y(t, "delete", e, void 0, r), i);
      }
      has(t, e) {
        let n = Reflect.has(t, e);
        return ((!zt(e) || !Kr.has(e)) && T(t, "has", e), n);
      }
      ownKeys(t) {
        return (T(t, "iterate", Ut(t) ? "length" : rt), Reflect.ownKeys(t));
      }
    },
    gs = class extends qr {
      constructor(t = !1) {
        super(!0, t);
      }
      set(t, e) {
        return (ot(`Set operation on key "${String(e)}" failed: target is readonly.`, t), !0);
      }
      deleteProperty(t, e) {
        return (ot(`Delete operation on key "${String(e)}" failed: target is readonly.`, t), !0);
      }
    },
    ms = new ps(),
    _s = new gs(),
    Qe = (t) => t,
    re = (t) => Reflect.getPrototypeOf(t);
  function ys(t, e, n) {
    return function (...r) {
      let i = this.__v_raw,
        a = b(i),
        s = jt(a),
        o = t === "entries" || (t === Symbol.iterator && s),
        u = t === "keys" && s,
        l = i[t](...r),
        d = n ? Qe : e ? Kt : ct;
      return (
        !e && T(a, "iterate", u ? Ze : rt),
        Ft(Object.create(l), {
          next() {
            let { value: p, done: m } = l.next();
            return m ? { value: p, done: m } : { value: o ? [d(p[0]), d(p[1])] : d(p), done: m };
          },
        })
      );
    };
  }
  function ie(t) {
    return function (...e) {
      {
        let n = e[0] ? `on key "${e[0]}" ` : "";
        ot(`${Pr(t)} operation ${n}failed: target is readonly.`, b(this));
      }
      return t === "delete" ? !1 : t === "clear" ? void 0 : this;
    };
  }
  function xs(t, e) {
    let n = {
      get(i) {
        let a = this.__v_raw,
          s = b(a),
          o = b(i);
        t || (tt(i, o) && T(s, "get", i), T(s, "get", o));
        let { has: u } = re(s),
          l = e ? Qe : t ? Kt : ct;
        if (u.call(s, i)) return l(a.get(i));
        if (u.call(s, o)) return l(a.get(o));
        a !== s && a.get(i);
      },
      get size() {
        let i = this.__v_raw;
        return (!t && T(b(i), "iterate", rt), i.size);
      },
      has(i) {
        let a = this.__v_raw,
          s = b(a),
          o = b(i);
        return (
          t || (tt(i, o) && T(s, "has", i), T(s, "has", o)),
          i === o ? a.has(i) : a.has(i) || a.has(o)
        );
      },
      forEach(i, a) {
        let s = this,
          o = s.__v_raw,
          u = b(o),
          l = e ? Qe : t ? Kt : ct;
        return (!t && T(u, "iterate", rt), o.forEach((d, p) => i.call(a, l(d), l(p), s)));
      },
    };
    return (
      Ft(
        n,
        t
          ? { add: ie("add"), set: ie("set"), delete: ie("delete"), clear: ie("clear") }
          : {
              add(i) {
                let a = b(this),
                  s = re(a),
                  o = b(i),
                  u = !e && !lt(i) && !ut(i) ? o : i;
                return (
                  s.has.call(a, u) ||
                    (tt(i, u) && s.has.call(a, i)) ||
                    (tt(o, u) && s.has.call(a, o)) ||
                    (a.add(u), Y(a, "add", u, u)),
                  this
                );
              },
              set(i, a) {
                !e && !lt(a) && !ut(a) && (a = b(a));
                let s = b(this),
                  { has: o, get: u } = re(s),
                  l = o.call(s, i);
                l ? Pn(s, o, i) : ((i = b(i)), (l = o.call(s, i)));
                let d = u.call(s, i);
                return (
                  s.set(i, a),
                  l ? tt(a, d) && Y(s, "set", i, a, d) : Y(s, "add", i, a),
                  this
                );
              },
              delete(i) {
                let a = b(this),
                  { has: s, get: o } = re(a),
                  u = s.call(a, i);
                u ? Pn(a, s, i) : ((i = b(i)), (u = s.call(a, i)));
                let l = o ? o.call(a, i) : void 0,
                  d = a.delete(i);
                return (u && Y(a, "delete", i, void 0, l), d);
              },
              clear() {
                let i = b(this),
                  a = i.size !== 0,
                  s = jt(i) ? new Map(i) : new Set(i),
                  o = i.clear();
                return (a && Y(i, "clear", void 0, void 0, s), o);
              },
            },
      ),
      ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
        n[i] = ys(i, t, e);
      }),
      n
    );
  }
  function Jr(t, e) {
    let n = xs(t, e);
    return (r, i, a) =>
      i === "__v_isReactive"
        ? !t
        : i === "__v_isReadonly"
          ? t
          : i === "__v_raw"
            ? r
            : Reflect.get(Ve(n, i) && i in r ? n : r, i, a);
  }
  var bs = { get: Jr(!1, !1) },
    ws = { get: Jr(!0, !1) };
  function Pn(t, e, n) {
    let r = b(n);
    if (r !== n && e.call(t, r)) {
      let i = Nr(t);
      ot(
        `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`,
      );
    }
  }
  var zr = new WeakMap(),
    vs = new WeakMap(),
    Yr = new WeakMap(),
    Ss = new WeakMap();
  function ks(t) {
    switch (t) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function vn(t) {
    return ut(t) ? t : Vr(t, !1, ms, bs, zr);
  }
  function tn(t) {
    return Vr(t, !0, _s, ws, Yr);
  }
  function Vr(t, e, n, r, i) {
    if (!Ht(t)) return (ot(`value cannot be made ${e ? "readonly" : "reactive"}: ${String(t)}`), t);
    if ((t.__v_raw && !(e && t.__v_isReactive)) || t.__v_skip || !Object.isExtensible(t)) return t;
    let a = i.get(t);
    if (a) return a;
    let s = ks(Nr(t));
    if (s === 0) return t;
    let o = new Proxy(t, s === 2 ? r : n);
    return (i.set(t, o), o);
  }
  function Gr(t) {
    return ut(t) ? Gr(t.__v_raw) : !!(t && t.__v_isReactive);
  }
  function ut(t) {
    return !!(t && t.__v_isReadonly);
  }
  function lt(t) {
    return !!(t && t.__v_isShallow);
  }
  function Es(t) {
    return t ? !!t.__v_raw : !1;
  }
  function b(t) {
    let e = t && t.__v_raw;
    return e ? b(e) : t;
  }
  var ct = (t) => (Ht(t) ? vn(t) : t),
    Kt = (t) => (Ht(t) ? tn(t) : t);
  function Nt(t) {
    return t ? t.__v_isRef === !0 : !1;
  }
  R("nextTick", () => hn);
  R("dispatch", (t) => $t.bind($t, t));
  R("watch", (t, { evaluateLater: e, cleanup: n }) => (r, i) => {
    let a = e(r),
      o = Kn(() => {
        let u;
        return (a((l) => (u = l)), u);
      }, i);
    n(o);
  });
  R("store", Wa);
  R("data", (t) => Zn(t));
  R("root", (t) => _e(t));
  R("refs", (t) => (t._x_refs_proxy || (t._x_refs_proxy = at(As(t))), t._x_refs_proxy));
  function As(t) {
    let e = [];
    return (
      I(t, (n) => {
        n._x_refs && e.push(n._x_refs);
      }),
      e
    );
  }
  var je = {};
  function Xr(t) {
    return (je[t] || (je[t] = 0), ++je[t]);
  }
  function Ms(t, e) {
    return I(t, (n) => {
      if (n._x_ids && n._x_ids[e]) return !0;
    });
  }
  function Os(t, e) {
    (t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = Xr(e)));
  }
  R("id", (t, { cleanup: e }) => (n, r = null) => {
    let i = `${n}${r ? `-${r}` : ""}`;
    return Cs(t, i, e, () => {
      let a = Ms(t, n),
        s = a ? a._x_ids[n] : Xr(n);
      return r ? `${n}-${s}-${r}` : `${n}-${s}`;
    });
  });
  Jt((t, e) => {
    t._x_id && (e._x_id = t._x_id);
  });
  function Cs(t, e, n, r) {
    if ((t._x_id || (t._x_id = {}), t._x_id[e])) return t._x_id[e];
    let i = r();
    return (
      (t._x_id[e] = i),
      n(() => {
        delete t._x_id[e];
      }),
      i
    );
  }
  R("el", (t) => t);
  Zr("Focus", "focus", "focus");
  Zr("Persist", "persist", "persist");
  function Zr(t, e, n) {
    R(e, (r) =>
      P(
        `You can't use [$${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`,
        r,
      ),
    );
  }
  S("modelable", (t, { expression: e }, { effect: n, evaluateLater: r, cleanup: i }) => {
    let a = r(e),
      s = () => {
        let d;
        return (a((p) => (d = p)), d);
      },
      o = r(`${e} = __placeholder`),
      u = (d) => o(() => {}, { scope: { __placeholder: d } }),
      l = s();
    (u(l),
      queueMicrotask(() => {
        if (!t._x_model) return;
        t._x_removeModelListeners.default();
        let d = t._x_model.get,
          p = t._x_model.setWithModifiers,
          m = Ir(
            {
              get() {
                return d();
              },
              set(h) {
                p(h);
              },
            },
            {
              get() {
                return s();
              },
              set(h) {
                u(h);
              },
            },
          );
        i(m);
      }));
  });
  S("teleport", (t, { modifiers: e, expression: n }, { cleanup: r }) => {
    t.tagName.toLowerCase() !== "template" &&
      P("x-teleport can only be used on a <template> tag", t);
    let i = Bn(n),
      a = t.content.cloneNode(!0).firstElementChild;
    ((t._x_teleport = a),
      (a._x_teleportBack = t),
      t.setAttribute("data-teleport-template", !0),
      a.setAttribute("data-teleport-target", !0),
      t._x_forwardEvents &&
        t._x_forwardEvents.forEach((o) => {
          a.addEventListener(o, (u) => {
            (u.stopPropagation(), t.dispatchEvent(new u.constructor(u.type, u)));
          });
        }),
      qt(a, {}, t));
    let s = (o, u, l) => {
      l.includes("prepend")
        ? u.parentNode.insertBefore(o, u)
        : l.includes("append")
          ? u.parentNode.insertBefore(o, u.nextSibling)
          : u.appendChild(o);
    };
    (v(() => {
      q(() => {
        (s(a, i, e), B(a));
      })();
    }),
      (t._x_teleportPutBack = () => {
        let o = Bn(n);
        v(() => {
          s(t._x_teleport, o, e);
        });
      }),
      r(() =>
        v(() => {
          (a.remove(), dt(a));
        }),
      ));
  });
  var Ts = document.createElement("div");
  function Bn(t) {
    let e = q(
      () => document.querySelector(t),
      () => Ts,
    )();
    return (e || P(`Cannot find x-teleport element for selector: "${t}"`), e);
  }
  var Qr = () => {};
  Qr.inline = (t, { modifiers: e }, { cleanup: n }) => {
    (e.includes("self") ? (t._x_ignoreSelf = !0) : (t._x_ignore = !0),
      n(() => {
        e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore;
      }));
  };
  S("ignore", Qr);
  S(
    "effect",
    q((t, { expression: e }, { effect: n }) => {
      n(O(t, e));
    }),
  );
  function yt(t, e, n, r) {
    let i = t,
      a = (u) => r(u),
      s = {},
      o = (u, l) => (d) => l(u, d);
    return (
      n.includes("dot") && (e = Is(e)),
      n.includes("camel") && (e = Ds(e)),
      n.includes("capture") && (s.capture = !0),
      n.includes("window") && (i = window),
      n.includes("document") && (i = document),
      n.includes("passive") && (s.passive = n[n.indexOf("passive") + 1] !== "false"),
      (a = ti(n, a)),
      n.includes("prevent") &&
        (a = o(a, (u, l) => {
          (l.preventDefault(), u(l));
        })),
      n.includes("stop") &&
        (a = o(a, (u, l) => {
          (l.stopPropagation(), u(l));
        })),
      n.includes("once") &&
        (a = o(a, (u, l) => {
          (u(l), i.removeEventListener(e, a, s));
        })),
      (n.includes("away") || n.includes("outside")) &&
        ((i = document),
        (a = o(a, (u, l) => {
          t.contains(l.target) ||
            (l.target.isConnected !== !1 &&
              ((t.offsetWidth < 1 && t.offsetHeight < 1) || (t._x_isShown !== !1 && u(l))));
        }))),
      n.includes("self") &&
        (a = o(a, (u, l) => {
          l.target === t && u(l);
        })),
      e === "submit" &&
        (a = o(a, (u, l) => {
          (l.target._x_pendingModelUpdates && l.target._x_pendingModelUpdates.forEach((d) => d()),
            u(l));
        })),
      (js(e) || ei(e)) &&
        (a = o(a, (u, l) => {
          Ls(l, n) || u(l);
        })),
      i.addEventListener(e, a, s),
      () => {
        i.removeEventListener(e, a, s);
      }
    );
  }
  function ti(t, e) {
    if (t.includes("debounce")) {
      let n = t[t.indexOf("debounce") + 1] || "invalid-wait",
        r = de(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
      e = Cr(e, r);
    }
    if (t.includes("throttle")) {
      let n = t[t.indexOf("throttle") + 1] || "invalid-wait",
        r = de(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
      e = Tr(e, r);
    }
    return e;
  }
  function Is(t) {
    return t.replace(/-/g, ".");
  }
  function Ds(t) {
    return t.toLowerCase().replace(/-(\w)/g, (e, n) => n.toUpperCase());
  }
  function de(t) {
    return !Array.isArray(t) && !isNaN(t);
  }
  function $s(t) {
    return [" ", "_"].includes(t)
      ? t
      : t
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .replace(/[_\s]/, "-")
          .toLowerCase();
  }
  function js(t) {
    return ["keydown", "keyup"].includes(t);
  }
  function ei(t) {
    return ["contextmenu", "click", "mouse"].some((e) => t.includes(e));
  }
  var Rs = [
    "window",
    "document",
    "prevent",
    "stop",
    "once",
    "capture",
    "self",
    "away",
    "outside",
    "passive",
    "dot",
    "camel",
    "preserve-scroll",
    "blur",
    "change",
    "lazy",
    "number",
    "boolean",
    "trim",
    "fill",
    "unintrusive",
    "parent",
  ];
  function Ls(t, e) {
    let n = e.filter((a, s) => (a === "false" && e[s - 1] === "passive" ? !1 : !Rs.includes(a)));
    if (n.includes("debounce")) {
      let a = n.indexOf("debounce");
      n.splice(a, de((n[a + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
    }
    if (n.includes("throttle")) {
      let a = n.indexOf("throttle");
      n.splice(a, de((n[a + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
    }
    if (n.length === 0 || (n.length === 1 && Fn(t.key).includes(n[0]))) return !1;
    let i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((a) => n.includes(a));
    return (
      (n = n.filter((a) => !i.includes(a))),
      !(
        i.length > 0 &&
        i.filter((s) => ((s === "cmd" || s === "super") && (s = "meta"), t[`${s}Key`])).length ===
          i.length &&
        (ei(t.type) || Fn(t.key).includes(n[0]))
      )
    );
  }
  function Fn(t) {
    if (!t) return [];
    t = $s(t);
    let e = {
      ctrl: "control",
      slash: "/",
      space: " ",
      spacebar: " ",
      cmd: "meta",
      esc: "escape",
      up: "arrow-up",
      down: "arrow-down",
      left: "arrow-left",
      right: "arrow-right",
      period: ".",
      comma: ",",
      equal: "=",
      minus: "-",
      underscore: "_",
    };
    return (
      (e[t] = t),
      Object.keys(e)
        .map((n) => {
          if (e[n] === t) return n;
        })
        .filter((n) => n)
    );
  }
  S("model", (t, { modifiers: e, expression: n }, { effect: r, cleanup: i }) => {
    let a = t;
    e.includes("parent") && (a = I(t, (f) => f !== t));
    let s = O(a, n),
      o;
    typeof n == "string"
      ? (o = O(a, `${n} = __placeholder`))
      : typeof n == "function" && typeof n() == "string"
        ? (o = O(a, `${n()} = __placeholder`))
        : (o = () => {});
    let u = () => {
        let f;
        return (s((c) => (f = c)), Un(f) ? f.get() : f);
      },
      l = (f) => {
        let c;
        (s((g) => (c = g)), Un(c) ? c.set(f) : o(() => {}, { scope: { __placeholder: f } }));
      };
    typeof n == "string" &&
      t.type === "radio" &&
      v(() => {
        t.hasAttribute("name") || t.setAttribute("name", n);
      });
    let d = e.includes("change") || e.includes("lazy"),
      p = e.includes("blur"),
      m = e.includes("enter"),
      h = d || p || m,
      _;
    if (V) _ = () => {};
    else if (h) {
      let f = [],
        c = (g) => l(ae(t, e, g, u()));
      if ((d && f.push(yt(t, "change", e, c)), p && (f.push(yt(t, "blur", e, c)), t.form))) {
        let g = t.form,
          y = () => c({ target: t });
        (g._x_pendingModelUpdates || (g._x_pendingModelUpdates = []),
          g._x_pendingModelUpdates.push(y),
          i(() => {
            g._x_pendingModelUpdates &&
              g._x_pendingModelUpdates.splice(g._x_pendingModelUpdates.indexOf(y), 1);
          }));
      }
      (m &&
        f.push(
          yt(t, "keydown", e, (g) => {
            g.key === "Enter" && c(g);
          }),
        ),
        (_ = () => f.forEach((g) => g())));
    } else {
      let f =
        t.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(t.type)
          ? "change"
          : "input";
      _ = yt(t, f, e, (c) => {
        l(ae(t, e, c, u()));
      });
    }
    if (
      (e.includes("fill") &&
        ([void 0, null, ""].includes(u()) ||
          (ce(t) && Array.isArray(u())) ||
          (t.tagName.toLowerCase() === "select" && t.multiple)) &&
        l(ae(t, e, { target: t }, u())),
      t._x_removeModelListeners || (t._x_removeModelListeners = {}),
      (t._x_removeModelListeners.default = _),
      i(() => t._x_removeModelListeners.default()),
      t.form)
    ) {
      let f = yt(t.form, "reset", [], (c) => {
        hn(() => t._x_model && t._x_model.set(ae(t, e, { target: t }, u())));
      });
      i(() => f());
    }
    if (
      ((t._x_model = {
        get() {
          return u();
        },
        set(f) {
          l(f);
        },
        setWithModifiers: ti(e, l),
      }),
      (t._x_forceModelUpdate = (f) => {
        (f === void 0 && typeof n == "string" && n.match(/\./) && (f = ""),
          v(() => {
            ce(t)
              ? Array.isArray(f)
                ? (t.checked = f.some((c) => c == t.value))
                : (t.checked = !!f)
              : mn(t)
                ? typeof f == "boolean"
                  ? (t.checked = se(t.value) === f)
                  : (t.checked = t.value == f)
                : Ar(t, "value", f);
          }));
      }),
      t.tagName === "SELECT")
    ) {
      let f = new MutationObserver(() => {
        t._x_forceModelUpdate(u());
      });
      (f.observe(t, { childList: !0 }), i(() => f.disconnect()));
    }
    r(() => {
      let f = u();
      (e.includes("unintrusive") && document.activeElement.isSameNode(t)) ||
        t._x_forceModelUpdate(f);
    });
  });
  function ae(t, e, n, r) {
    return v(() => {
      if (n instanceof CustomEvent && n.detail !== void 0)
        return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
      if (ce(t))
        if (Array.isArray(r)) {
          let i = null;
          return (
            e.includes("number")
              ? (i = Re(n.target.value))
              : e.includes("boolean")
                ? (i = se(n.target.value))
                : (i = n.target.value),
            n.target.checked ? (r.includes(i) ? r : r.concat([i])) : r.filter((a) => !Ns(a, i))
          );
        } else return n.target.checked;
      else {
        if (t.tagName.toLowerCase() === "select" && t.multiple)
          return e.includes("number")
            ? Array.from(n.target.selectedOptions).map((i) => {
                let a = i.value || i.text;
                return Re(a);
              })
            : e.includes("boolean")
              ? Array.from(n.target.selectedOptions).map((i) => {
                  let a = i.value || i.text;
                  return se(a);
                })
              : Array.from(n.target.selectedOptions).map((i) => i.value || i.text);
        {
          let i;
          return (
            mn(t) ? (n.target.checked ? (i = n.target.value) : (i = r)) : (i = n.target.value),
            e.includes("number")
              ? Re(i)
              : e.includes("boolean")
                ? se(i)
                : e.includes("trim")
                  ? i.trim()
                  : i
          );
        }
      }
    });
  }
  function Re(t) {
    let e = t ? parseFloat(t) : null;
    return Ps(e) ? e : t;
  }
  function Ns(t, e) {
    return t == e;
  }
  function Ps(t) {
    return !Array.isArray(t) && !isNaN(t);
  }
  function Un(t) {
    return (
      t !== null && typeof t == "object" && typeof t.get == "function" && typeof t.set == "function"
    );
  }
  S("cloak", (t) => queueMicrotask(() => v(() => t.removeAttribute(St("cloak")))));
  vr(() => `[${St("init")}]`);
  S(
    "init",
    q((t, { expression: e }, { evaluate: n }) =>
      typeof e == "string" ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1),
    ),
  );
  S("text", (t, { expression: e }, { effect: n, evaluateLater: r }) => {
    let i = r(e);
    n(() => {
      i((a) => {
        v(() => {
          t.textContent = a;
        });
      });
    });
  });
  S("html", (t, { expression: e }, { effect: n, evaluateLater: r }) => {
    let i = r(e);
    n(
      () => {
        i((a) => {
          v(() => {
            (Array.from(t.children).forEach((s) => dt(s)),
              (t.innerHTML = a != null ? a : ""),
              (t._x_ignoreSelf = !0),
              B(t),
              delete t._x_ignoreSelf);
          });
        });
      },
      { priority: "structural" },
    );
  });
  cn(lr(":", cr(St("bind:"))));
  var ni = (
    t,
    { value: e, modifiers: n, expression: r, original: i },
    { effect: a, cleanup: s },
  ) => {
    if (!e) {
      let u = {};
      (qa(u),
        O(t, r)(
          (d) => {
            $r(t, d, i);
          },
          { scope: u },
        ));
      return;
    }
    if (e === "key") return Bs(t, r);
    if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract) return;
    let o = O(t, r);
    (a(() =>
      o((u) => {
        (u === void 0 && typeof r == "string" && r.match(/\./) && (u = ""),
          v(() => Ar(t, e, u, n)));
      }),
    ),
      s(() => {
        (t._x_undoAddedClasses && t._x_undoAddedClasses(),
          t._x_undoAddedStyles && t._x_undoAddedStyles());
      }));
  };
  ni.inline = (t, { value: e, modifiers: n, expression: r }) => {
    e &&
      (t._x_inlineBindings || (t._x_inlineBindings = {}),
      (t._x_inlineBindings[e] = { expression: r, extract: !1 }));
  };
  S("bind", ni);
  function Bs(t, e) {
    t._x_keyExpression = e;
  }
  wr(() => `[${St("data")}]`);
  var Z = Symbol();
  S("data", (t, { expression: e }, { cleanup: n }) => {
    if (Us(t)) return;
    let r = t[Z];
    if ((r == null ? void 0 : r.expression) === e) return;
    e = e === "" ? "{}" : e;
    let i = {};
    Pt(i, t);
    let a = {};
    za(a, i);
    let s = nt(t, e, { scope: a });
    ((s === void 0 || s === !0) && (s = {}), Pt(s, t));
    let o;
    if (r != null && r.reactiveData) {
      ((o = r.reactiveData), Fs(o, s));
      let l = { expression: e };
      ((t[Z] = l),
        queueMicrotask(() => {
          t[Z] === l && delete t[Z];
        }));
    } else o = wt(s);
    un(o, n);
    let u = qt(t, o);
    (q(() => {
      o.init && nt(t, o.init);
    })(),
      n(() => {
        (o.destroy && nt(t, o.destroy), u());
        let l = { reactiveData: o };
        ((t[Z] = l),
          queueMicrotask(() => {
            t[Z] === l && delete t[Z];
          }));
      }));
  });
  function Fs(t, e) {
    (Object.keys(e).forEach((n) => {
      let r = Object.getOwnPropertyDescriptor(e, n),
        i = Object.getOwnPropertyDescriptor(t, n);
      r.get || r.set || (i != null && i.get) || (i != null && i.set)
        ? (i && delete t[n],
          i || (t[n] = void 0),
          r.get || r.set ? Object.defineProperty(t, n, r) : (t[n] = e[n]))
        : (t[n] = e[n]);
    }),
      Object.keys(t)
        .filter((n) => !Object.prototype.hasOwnProperty.call(e, n))
        .forEach((n) => delete t[n]));
  }
  Jt((t, e) => {
    t._x_dataStack &&
      ((e._x_dataStack = t._x_dataStack), e.setAttribute("data-has-alpine-state", !0));
  });
  function Us(t) {
    return V ? (We ? !0 : t.hasAttribute("data-has-alpine-state")) : !1;
  }
  S("show", (t, { modifiers: e, expression: n }, { effect: r }) => {
    let i = O(t, n);
    (t._x_doHide ||
      (t._x_doHide = () => {
        v(() => {
          t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0);
        });
      }),
      t._x_doShow ||
        (t._x_doShow = () => {
          v(() => {
            t.style.length === 1 && t.style.display === "none"
              ? t.removeAttribute("style")
              : t.style.removeProperty("display");
          });
        }));
    let a = () => {
        (t._x_doHide(), (t._x_isShown = !1));
      },
      s = () => {
        (t._x_doShow(), (t._x_isShown = !0));
      },
      o = () => setTimeout(s),
      u = ze(
        (p) => (p ? s() : a()),
        (p) => {
          typeof t._x_toggleAndCascadeWithTransitions == "function"
            ? t._x_toggleAndCascadeWithTransitions(t, p, s, a)
            : p
              ? o()
              : a();
        },
      ),
      l,
      d = !0;
    r(() =>
      i((p) => {
        (!d && p === l) || (e.includes("immediate") && (p ? o() : a()), u(p), (l = p), (d = !1));
      }),
    );
  });
  S(
    "for",
    q((t, { expression: e }, { effect: n, cleanup: r }) => {
      let i = Ks(e),
        a = O(t, i.items),
        s = O(t, t._x_keyExpression || "index");
      ((t._x_lookup = new Map()),
        n(() => Ws(t, i, a, s), { priority: "structural" }),
        r(() => {
          (t._x_lookup.forEach((o) =>
            v(() => {
              (dt(o), o.remove());
            }),
          ),
            delete t._x_lookup,
            delete t._x_lastRenderedEl);
        }));
    }),
  );
  function Hs(t) {
    return (e) => {
      Object.entries(e).forEach(([n, r]) => {
        t[n] = r;
      });
    };
  }
  function Ws(t, e, n, r) {
    n((i) => {
      (Js(i) && (i = Array.from({ length: i }, (l, d) => d + 1)),
        i == null && (i = []),
        i instanceof Set && (i = Array.from(i)),
        i instanceof Map && (i = Array.from(i)));
      let a = t._x_lookup,
        s = new Map();
      t._x_lookup = s;
      let o = zs(i),
        u = Object.entries(i).map(([l, d]) => {
          o || (l = parseInt(l));
          let p = qs(e, d, l, i),
            m;
          return (
            r(
              (h) => {
                (typeof h == "object" &&
                  P("x-for key cannot be an object, it must be a string or an integer", t),
                  a.has(h) && (s.set(h, a.get(h)), a.delete(h)),
                  (m = h));
              },
              { scope: { index: l, ...p } },
            ),
            [m, p]
          );
        });
      v(() => {
        a.forEach((p) => {
          (dt(p), p.remove());
        });
        let l = new Set(),
          d = t;
        (u.forEach(([p, m]) => {
          if (s.has(p)) {
            let f = s.get(p);
            (f._x_refreshXForScope(m),
              d.nextElementSibling !== f &&
                (d.nextElementSibling && f.replaceWith(d.nextElementSibling), d.after(f)),
              (d = f),
              f._x_currentIfEl &&
                (f.nextElementSibling !== f._x_currentIfEl && d.after(f._x_currentIfEl),
                (d = f._x_currentIfEl)));
            return;
          }
          t.content.children.length > 1 &&
            P(
              "x-for templates require a single root element, additional elements will be ignored.",
              t,
            );
          let h = document.importNode(t.content, !0).firstElementChild,
            _ = wt(m);
          (qt(h, _, t),
            (h._x_refreshXForScope = Hs(_)),
            s.set(p, h),
            l.add(h),
            d.after(h),
            (d = h));
        }),
          l.forEach((p) => B(p)),
          d !== t ? (t._x_lastRenderedEl = d) : delete t._x_lastRenderedEl);
      });
    });
  }
  function Ks(t) {
    let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
      n = /^\s*\(|\)\s*$/g,
      r = /([\s\S]*?)\b(?:in|of)\b([\s\S]*)/,
      i = t.match(r);
    if (!i) return;
    let a = {};
    a.items = i[2].trim();
    let s = i[1].replace(n, "").trim(),
      o = s.match(e);
    return (
      o
        ? ((a.item = s.replace(e, "").trim()),
          (a.index = o[1].trim()),
          o[2] && (a.collection = o[2].trim()))
        : (a.item = s),
      a
    );
  }
  function qs(t, e, n, r) {
    let i = {};
    return (
      /^\[.*\]$/.test(t.item) && Array.isArray(e)
        ? t.item
            .replace("[", "")
            .replace("]", "")
            .split(",")
            .map((s) => s.trim())
            .forEach((s, o) => {
              i[s] = e[o];
            })
        : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && typeof e == "object"
          ? t.item
              .replace("{", "")
              .replace("}", "")
              .split(",")
              .map((s) => s.trim())
              .forEach((s) => {
                i[s] = e[s];
              })
          : (i[t.item] = e),
      t.index && (i[t.index] = n),
      t.collection && (i[t.collection] = r),
      i
    );
  }
  function Js(t) {
    return typeof t != "object" && !isNaN(t);
  }
  function zs(t) {
    return typeof t == "object" && !Array.isArray(t);
  }
  function ri() {}
  ri.inline = (t, { expression: e }, { cleanup: n }) => {
    let r = _e(t);
    r && (r._x_refs || (r._x_refs = {}), (r._x_refs[e] = t), n(() => delete r._x_refs[e]));
  };
  S("ref", ri);
  S(
    "if",
    q((t, { expression: e }, { effect: n, cleanup: r }) => {
      t.tagName.toLowerCase() !== "template" && P("x-if can only be used on a <template> tag", t);
      let i = O(t, e),
        a = () => {
          if (t._x_currentIfEl) return t._x_currentIfEl;
          let o = t.content.cloneNode(!0).firstElementChild;
          return (
            qt(o, {}, t),
            v(() => {
              (t.after(o), B(o));
            }),
            (t._x_currentIfEl = o),
            (t._x_lastRenderedEl = o),
            (t._x_undoIf = () => {
              (v(() => {
                (dt(o), o.remove());
              }),
                delete t._x_currentIfEl,
                delete t._x_lastRenderedEl);
            }),
            o
          );
        },
        s = () => {
          t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf);
        };
      (n(
        () =>
          i((o) => {
            o ? a() : s();
          }),
        { priority: "structural" },
      ),
        r(() => t._x_undoIf && t._x_undoIf()));
    }),
  );
  S("id", (t, { expression: e }, { evaluate: n }) => {
    n(e).forEach((i) => Os(t, i));
  });
  Jt((t, e) => {
    t._x_ids && (e._x_ids = t._x_ids);
  });
  cn(lr("@", cr(St("on:"))));
  S(
    "on",
    q((t, { value: e, modifiers: n, expression: r }, { cleanup: i }) => {
      let a = r ? O(t, r) : () => {};
      t.tagName.toLowerCase() === "template" &&
        (t._x_forwardEvents || (t._x_forwardEvents = []),
        t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
      let s = yt(t, e, n, (o) => {
        a(() => {}, { scope: { $event: o }, params: [o] });
      });
      i(() => s());
    }),
  );
  be("Collapse", "collapse", "collapse");
  be("Intersect", "intersect", "intersect");
  be("Focus", "trap", "focus");
  be("Mask", "mask", "mask");
  function be(t, e, n) {
    S(e, (r) =>
      P(
        `You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`,
        r,
      ),
    );
  }
  kt.setEvaluator(Yi);
  kt.setRawEvaluator(Qi);
  kt.setReactivityEngine({
    reactive: vn,
    effect: (t, e = {}) => {
      let n;
      return (
        (n = is(t, {
          scheduler: () => {
            n && (e.scheduler ? e.scheduler(n) : n());
          },
        })),
        n
      );
    },
    release: as,
    raw: b,
  });
  var Ys = kt,
    we = Ys;
  var En = {};
  bi(En, {
    COLORS: () => k,
    DAYS: () => ii,
    MONTHS: () => Yt,
    MONTHS_SHORT: () => Vt,
    compact: () => At,
    dateLong: () => ve,
    dateShort: () => Xt,
    daysInMonth: () => pt,
    esc: () => Gs,
    firstGrapheme: () => L,
    fmt: () => Et,
    isValidYmd: () => J,
    monthLabel: () => Sn,
    monthLabelLong: () => kn,
    normKey: () => Qt,
    pad: () => F,
    parseDate: () => Zt,
    parseNum: () => gt,
    parseYmd: () => Mt,
    rp: () => Vs,
    safeColor: () => ht,
    shiftMonth: () => Gt,
    uid: () => C,
    ym: () => D,
    ymd: () => U,
  });
  var C = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    F = (t) => String(t).padStart(2, "0"),
    U = (t) => `${t.getFullYear()}-${F(t.getMonth() + 1)}-${F(t.getDate())}`,
    D = (t) => `${t.getFullYear()}-${F(t.getMonth() + 1)}`,
    Yt = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    Vt = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    ii = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    ai = new Intl.NumberFormat("id-ID"),
    Et = (t) => ai.format(Math.round(t || 0)),
    Vs = (t) => (t < 0 ? "-" : "") + "Rp\xA0" + ai.format(Math.abs(Math.round(t || 0)));
  function At(t) {
    t = Math.round(t || 0);
    let e = t < 0 ? "-" : "";
    t = Math.abs(t);
    let n = (r, i) => e + r.toFixed(1).replace(".", ",").replace(/,0$/, "") + i;
    return t >= 1e9
      ? n(t / 1e9, "M")
      : t >= 1e6
        ? n(t / 1e6, "jt")
        : t >= 1e3
          ? e + Math.round(t / 1e3) + "rb"
          : e + t;
  }
  var Gs = (t) =>
      String(t != null ? t : "").replace(
        /[&<>"']/g,
        (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[e],
      ),
    ht = (t, e = "#94A3B8") => (/^#[0-9a-f]{6}$/i.test(String(t)) ? String(t) : e),
    k = [
      "#7C5CFF",
      "#FF5FA2",
      "#C8F135",
      "#38BDF8",
      "#FB923C",
      "#34D399",
      "#F472B6",
      "#A78BFA",
      "#FACC15",
      "#94A3B8",
    ];
  function J(t) {
    let e = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t));
    if (!e) return !1;
    let n = new Date(+e[1], +e[2] - 1, +e[3]);
    return n.getFullYear() === +e[1] && n.getMonth() === +e[2] - 1 && n.getDate() === +e[3];
  }
  var Mt = (t) => {
      let [e, n, r] = t.split("-").map(Number);
      return new Date(e, n - 1, r);
    },
    pt = (t) => {
      let [e, n] = t.split("-").map(Number);
      return new Date(e, n, 0).getDate();
    },
    Sn = (t) => {
      let [e, n] = t.split("-").map(Number);
      return `${Vt[n - 1]} ${e}`;
    },
    kn = (t) => {
      let [e, n] = t.split("-").map(Number);
      return `${Yt[n - 1]} ${e}`;
    },
    Gt = (t, e) => {
      let [n, r] = t.split("-").map(Number);
      return D(new Date(n, r - 1 + e, 1));
    },
    Xt = (t) => {
      let e = Mt(t);
      return `${e.getDate()} ${Vt[e.getMonth()]} ${e.getFullYear()}`;
    },
    ve = (t) => {
      let e = Mt(t);
      return `${ii[e.getDay()]}, ${e.getDate()} ${Yt[e.getMonth()]}`;
    };
  function gt(t) {
    if (typeof t == "number") return Number.isFinite(t) ? t : 0;
    let e = String(t != null ? t : "")
      .replace(/rp\.?/gi, "")
      .replace(/\s/g, "");
    /^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(e)
      ? (e = e.replace(/\./g, "").replace(",", "."))
      : /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(e)
        ? (e = e.replace(/,/g, ""))
        : (e = e.replace(",", "."));
    let n = Number(e.replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  function Zt(t) {
    if (t === "" || t == null) return "";
    if (t instanceof Date) return isNaN(t) ? "" : U(new Date(t.getTime() + 432e5));
    let e = String(t).trim(),
      n = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(e);
    if (n) {
      let r = `${n[1]}-${F(n[2])}-${F(n[3])}`;
      return J(r) ? r : "";
    }
    if (((n = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/.exec(e)), n)) {
      let i = `${n[3].length === 2 ? "20" + n[3] : n[3]}-${F(n[2])}-${F(n[1])}`;
      return J(i) ? i : "";
    }
    return "";
  }
  function L(t, e = "") {
    let n = String(t != null ? t : "").trim();
    if (!n) return e;
    if (typeof Intl != "undefined" && Intl.Segmenter)
      for (let { segment: r } of new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(n))
        return r;
    return Array.from(n)[0] || e;
  }
  var Qt = (t) =>
    String(t)
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  var si = (t) => (t.type === "in" ? t.amount : -t.amount);
  function oi(t, e) {
    return e > 0 ? ((t - e) / e) * 100 : null;
  }
  function mt(t, e) {
    return window.DuitkuFinance.summarizeMonth(t, e);
  }
  function An(t, e) {
    return window.DuitkuFinance.summarizeYear(t, e);
  }
  function Se(t, e, n = "expense") {
    return window.DuitkuFinance.categoryBreakdown(t, e, n);
  }
  function ui(t, e) {
    return window.DuitkuFinance.dailyExpenses(t, e);
  }
  function li(t, e, n = 5) {
    return window.DuitkuFinance.topExpenses(t, e, n);
  }
  function ci(t, e) {
    let n = [],
      r = (i) => Math.round(i * 100) + "%";
    return (
      t.bestRate &&
        t.bestRate.rate > 0 &&
        n.push({
          icon: "piggy-bank",
          text: `Rasio tabung terbaik di ${t.bestRate.name}: ${r(t.bestRate.rate)} dari pemasukan.`,
        }),
      t.topExpense &&
        n.push({
          icon: "flame",
          text: `Pengeluaran tertinggi di ${t.topExpense.name}: Rp ${At(t.topExpense.expense)}.`,
        }),
      t.lowExpense &&
        t.topExpense &&
        t.lowExpense.key !== t.topExpense.key &&
        n.push({
          icon: "trending-down",
          text: `Bulan paling hemat: ${t.lowExpense.name} (Rp ${At(t.lowExpense.expense)}).`,
        }),
      t.deficits.length &&
        n.push({
          icon: "triangle-alert",
          text: `Pengeluaran melebihi pemasukan di ${t.deficits.map((i) => i.name).join(", ")}.`,
        }),
      e[0] &&
        n.push({
          icon: "chart-pie",
          text: `Kategori terbesar: ${e[0].cat.name}, ${Math.round(e[0].pct)}% dari seluruh pengeluaran.`,
        }),
      t.activeMonths > 0 &&
        n.push({
          icon: "coins",
          text: `Rata-rata per bulan: pengeluaran Rp ${At(t.avgExpense)}, ditabung ke target Rp ${At(t.avgSaved)}.`,
        }),
      n
    );
  }
  var ke = 3;
  function ne() {
    let t = (n, r, i) => ({
        id: "e_" + n.toLowerCase().replace(/\W+/g, "_"),
        name: n,
        emoji: r,
        type: "expense",
        color: k[i % k.length],
      }),
      e = (n, r, i) => ({
        id: "i_" + n.toLowerCase().replace(/\W+/g, "_"),
        name: n,
        emoji: r,
        type: "income",
        color: k[(i + 3) % k.length],
      });
    return {
      v: ke,
      name: "Kamu",
      dark: !1,
      hideBalance: !1,
      lastExport: "",
      wallets: [
        {
          id: "w_tunai",
          name: "Tunai",
          emoji: "\u{1F4B5}",
          kind: "cash",
          initial: 0,
        },
        {
          id: "w_bank",
          name: "Bank",
          emoji: "\u{1F3E6}",
          kind: "bank",
          initial: 0,
        },
        {
          id: "w_ewallet",
          name: "E-Wallet",
          emoji: "\u{1F4F1}",
          kind: "ewallet",
          initial: 0,
        },
      ],
      categories: [
        t("Makan & Minum", "\u{1F35C}", 0),
        t("Transportasi", "\u{1F6F5}", 1),
        t("Belanja", "\u{1F6CD}\uFE0F", 2),
        t("Tagihan", "\u{1F9FE}", 3),
        t("Kesehatan", "\u{1F48A}", 4),
        t("Hiburan", "\u{1F3AE}", 5),
        t("Pendidikan", "\u{1F4DA}", 6),
        t("Donasi", "\u{1F932}", 7),
        t("Lainnya", "\u2728", 9),
        e("Gaji", "\u{1F4BC}", 0),
        e("Bonus", "\u{1F381}", 1),
        e("Usaha", "\u{1F4B8}", 2),
        e("Lainnya Masuk", "\u{1FA99}", 3),
      ],
      transactions: [],
      budgets: {},
      targets: [],
    };
  }
  var G = (t, e) =>
      String(t != null ? t : "")
        .trim()
        .slice(0, e),
    Mn = (t) => {
      let e = Number(t);
      return Number.isFinite(e) ? e : 0;
    },
    te = (t) => Math.round(Mn(t));
  function ee() {
    let t = new Set();
    return (e) => {
      for (e = G(e, 40); !e || t.has(e);) e = C();
      return (t.add(e), e);
    };
  }
  function Ee(t) {
    let e = ne(),
      n = t && typeof t == "object" && !Array.isArray(t) ? t : {},
      r = (f) => (Array.isArray(f) ? f : []),
      i = (f) => (f && typeof f == "object" && !Array.isArray(f) ? f : {}),
      a = {
        v: ke,
        name: G(n.name, 30) || e.name,
        dark: !!n.dark,
        hideBalance: !!n.hideBalance,
        lastExport: G(n.lastExport, 40),
      },
      s = ee();
    ((a.wallets = r(n.wallets).map((f) =>
      window.DuitkuWallets.normalize({
        id: s(i(f).id),
        name: G(i(f).name, 24) || "Dompet",
        emoji: L(i(f).emoji, "\u{1F4B3}"),
        kind: i(f).kind,
        initial: te(i(f).initial),
      }),
    )),
      a.wallets.length || (a.wallets = e.wallets));
    let o = ee();
    a.categories = r(n.categories).map(
      (f, c) => (
        (f = i(f)),
        {
          id: o(f.id),
          name: G(f.name, 24) || "Kategori",
          emoji: L(f.emoji, "\u{1F3F7}\uFE0F"),
          type: f.type === "income" ? "income" : "expense",
          color: ht(f.color, k[c % k.length]),
        }
      ),
    );
    let u = (f, c) => {
      a.categories.some((g) => g.type === f) || a.categories.push({ ...c, id: o(c.id) });
    };
    (u(
      "expense",
      e.categories.find((f) => f.id === "e_lainnya"),
    ),
      u(
        "income",
        e.categories.find((f) => f.id === "i_lainnya_masuk"),
      ));
    let l = new Map(a.categories.map((f) => [f.id, f])),
      d = new Set(a.wallets.map((f) => f.id)),
      p = (f) =>
        a.categories.find((c) => c.type === f && /^lainnya/i.test(c.name)) ||
        a.categories.find((c) => c.type === f),
      m = ee();
    a.transactions = [];
    for (let f of r(n.transactions)) {
      let c = i(f),
        g = Math.abs(te(c.amount));
      if (!g || !J(c.date)) continue;
      const y = c.type === "transfer" ? "transfer" : c.type === "income" ? "income" : "expense";
      if (y === "transfer") {
        if (!d.has(c.walletId) || !d.has(c.toWalletId) || c.walletId === c.toWalletId) continue;
        a.transactions.push({
          id: m(c.id),
          type: "transfer",
          amount: g,
          feeAmount: Math.abs(te(c.feeAmount)),
          walletId: c.walletId,
          toWalletId: c.toWalletId,
          date: c.date,
          note: G(c.note, 120),
          ts: Mn(c.ts),
        });
        continue;
      }
      let E = l.get(c.categoryId) || p(y);
      a.transactions.push({
        id: m(c.id),
        type: y,
        amount: g,
        categoryId: E.id,
        walletId: d.has(c.walletId) ? c.walletId : a.wallets[0].id,
        date: c.date,
        note: G(c.note, 120),
        ts: Mn(c.ts),
      });
    }
    a.budgets = {};
    for (let [f, c] of Object.entries(i(n.budgets))) {
      let g = l.get(f),
        y = te(c);
      g && g.type === "expense" && y > 0 && (a.budgets[f] = y);
    }
    let h = ee(),
      _ = ee();
    return (
      (a.targets = []),
      r(n.targets).forEach((f, c) => {
        let g = i(f),
          y = te(g.target);
        if (!y) return;
        let E = [];
        for (let M of r(g.contribs)) {
          let A = i(M),
            X = Math.abs(te(A.amount));
          !X ||
            !J(A.date) ||
            E.push({
              id: _(A.id),
              type: A.type === "out" ? "out" : "in",
              amount: X,
              walletId: d.has(A.walletId) ? A.walletId : "",
              date: A.date,
              note: G(A.note, 120),
              ts: Mn(A.ts),
            });
        }
        a.targets.push({
          id: h(g.id),
          name: G(g.name, 40) || "Target",
          emoji: L(g.emoji, "\u{1F3AF}"),
          target: y,
          deadline: J(g.deadline) ? g.deadline : "",
          color: ht(g.color, k[c % k.length]),
          contribs: E,
        });
      }),
      a
    );
  }
  var Ot = {
    key: "duitku.v1",
    async load() {
      try {
        let t = localStorage.getItem(this.key);
        if (t) return Ee(JSON.parse(t));
      } catch (t) {
        console.warn("Gagal memuat data", t);
      }
      return ne();
    },
    async save(t) {
      try {
        return (localStorage.setItem(this.key, JSON.stringify(t)), !0);
      } catch (e) {
        return (console.warn("Gagal menyimpan data", e), !1);
      }
    },
  };
  var z = {
      tx: "Transaksi",
      targets: "Target",
      contribs: "Setoran Target",
      wallets: "Dompet",
      cats: "Kategori",
      budgets: "Anggaran",
      summary: "Ringkasan Bulanan",
      info: "Info",
    },
    Zs = 15 * 1024 * 1024,
    fi = (t) => /masuk|income|pemasukan|^in$/i.test(String(t)),
    Qs = (t) => /tarik|keluar|^out$/i.test(String(t));
  function On(t, e = () => "") {
    let n = new Set(),
      r = new Map();
    for (let i of t) {
      let a = i.name,
        s = 2;
      for (; n.has(e(i) + "|" + a.toLowerCase());) a = `${i.name} (${s++})`;
      (n.add(e(i) + "|" + a.toLowerCase()), r.set(i.id, a));
    }
    return r;
  }
  function to(t, e = new Date()) {
    let n = On(t.wallets),
      r = On(t.categories, (h) => h.type),
      i = On(t.targets),
      a = (h) => r.get(h) || "Lainnya",
      s = (h) => (h && n.get(h)) || "",
      o = (h, _) => _.date.localeCompare(h.date) || (_.ts || 0) - (h.ts || 0),
      u = (h) => (h === "income" ? "Pemasukan" : h === "transfer" ? "Transfer" : "Pengeluaran"),
      l = [
        ...t.transactions.map((h) => h.date),
        ...t.targets.flatMap((h) => h.contribs.map((_) => _.date)),
      ].sort(),
      d = [];
    if (l.length) {
      let h = l[0].slice(0, 7),
        _ = [l[l.length - 1].slice(0, 7), D(e)].sort().pop();
      for (let f = 0; h <= _ && f < 1200; f++) {
        d.push(h);
        let [c, g] = h.split("-").map(Number);
        h = D(new Date(c, g, 1));
      }
    }
    let p = d.map((h) => {
        let _ = mt(t, h);
        return [
          h,
          _.income,
          _.expense,
          _.net,
          _.saved,
          _.rate === null ? "" : Math.round(_.rate * 1e3) / 10,
        ];
      }),
      m = p.reduce((h, _) => [h[0] + _[1], h[1] + _[2], h[2] + _[3], h[3] + _[4]], [0, 0, 0, 0]);
    return (
      p.length && p.push(["Total", ...m, m[0] > 0 ? Math.round((m[2] / m[0]) * 1e3) / 10 : ""]),
      [
        {
          name: z.tx,
          head: [
            "Tanggal",
            "Jenis",
            "Kategori",
            "Dompet",
            "Dompet Tujuan",
            "Nominal",
            "Biaya Admin",
            "Catatan",
          ],
          widths: [12, 13, 20, 18, 18, 15, 15, 36],
          money: [5, 6],
          filter: !0,
          rows: [...t.transactions]
            .sort(o)
            .map((h) => [
              h.date,
              u(h.type),
              h.type === "transfer" ? "" : a(h.categoryId),
              s(h.walletId),
              h.type === "transfer" ? s(h.toWalletId) : "",
              h.amount,
              h.type === "transfer" ? Number(h.feeAmount) || 0 : "",
              h.note || "",
            ]),
        },
        {
          name: z.targets,
          head: ["Nama", "Ikon", "Nominal Target", "Tenggat", "Warna"],
          widths: [24, 8, 16, 13, 10],
          money: [2],
          rows: t.targets.map((h) => [i.get(h.id), h.emoji, h.target, h.deadline || "", h.color]),
        },
        {
          name: z.contribs,
          head: ["Nama Target", "Tanggal", "Jenis", "Nominal", "Dompet", "Catatan"],
          widths: [24, 12, 10, 15, 14, 36],
          money: [3],
          rows: t.targets.flatMap((h) =>
            [...h.contribs]
              .sort(o)
              .map((_) => [
                i.get(h.id),
                _.date,
                _.type === "out" ? "Tarik" : "Setor",
                _.amount,
                s(_.walletId),
                _.note || "",
              ]),
          ),
        },
        {
          name: z.wallets,
          head: ["Nama", "Ikon", "Saldo Awal", "Jenis Dompet"],
          widths: [24, 8, 16, 16],
          money: [2],
          rows: t.wallets.map((h) => [n.get(h.id), h.emoji, h.initial, h.kind || ""]),
        },
        {
          name: z.cats,
          head: ["Nama", "Jenis", "Ikon", "Warna"],
          widths: [24, 13, 8, 10],
          rows: t.categories.map((h) => [r.get(h.id), u(h.type), h.emoji, h.color]),
        },
        {
          name: z.budgets,
          head: ["Kategori", "Batas Bulanan"],
          widths: [24, 16],
          money: [1],
          rows: Object.entries(t.budgets)
            .filter(([h]) => r.has(h))
            .map(([h, _]) => [r.get(h), _]),
        },
        {
          name: z.summary,
          head: [
            "Bulan",
            "Pemasukan",
            "Pengeluaran",
            "Selisih",
            "Ditabung ke Target",
            "Rasio Tabung (%)",
          ],
          widths: [12, 16, 16, 16, 20, 18],
          money: [1, 2, 3, 4],
          rows: p,
        },
        {
          name: z.info,
          head: ["Kunci", "Nilai"],
          widths: [22, 30],
          rows: [
            ["Aplikasi", "Duitku"],
            ["Versi data", ke],
            ["Diekspor pada", e.toISOString()],
            ["Nama", t.name],
            ["Mode gelap", t.dark ? "Ya" : "Tidak"],
            ["Sembunyikan saldo", t.hideBalance ? "Ya" : "Tidak"],
            ["Jumlah transaksi", t.transactions.length],
            ["Jumlah target", t.targets.length],
          ],
        },
      ]
    );
  }
  function w(t, e) {
    let n = {};
    for (let r of Object.keys(t)) n[Qt(r)] = t[r];
    for (let r of e) if (n[r] !== void 0 && n[r] !== "") return n[r];
    return "";
  }
  function eo(t) {
    var h, _, f;
    let e = {};
    for (let [c, g] of Object.entries(z)) e[c] = t(g);
    let n = {};
    for (let c of e.info || []) {
      let g = Qt(w(c, ["kunci", "key"]));
      g && (n[g] = w(c, ["nilai", "value"]));
    }
    if (!e.tx && Qt(n.aplikasi || "") !== "duitku") throw new Error("FORMAT");
    let r = {
        name: String((h = n.nama) != null ? h : ""),
        dark: /^(ya|true|1)$/i.test(String((_ = n.modegelap) != null ? _ : "")),
        hideBalance: /^(ya|true|1)$/i.test(String((f = n.sembunyikansaldo) != null ? f : "")),
        lastExport: "",
        wallets: [],
        categories: [],
        transactions: [],
        budgets: {},
        targets: [],
      },
      i = 0,
      a = new Map(),
      s = (c, g, y, kind = "") => {
        c = String(c != null ? c : "").trim() || "Tunai";
        let E = c.toLowerCase();
        if (!a.has(E)) {
          let M = window.DuitkuWallets.normalize({
            id: C(),
            name: c,
            emoji: g || "\u{1F4B3}",
            kind,
            initial: gt(y),
          });
          (r.wallets.push(M), a.set(E, M));
        }
        return a.get(E);
      },
      o = new Map(),
      u = (c, g, y, E) => {
        c = String(c != null ? c : "").trim() || (g === "income" ? "Lainnya Masuk" : "Lainnya");
        let M = g + "|" + c.toLowerCase();
        if (!o.has(M)) {
          let A = {
            id: C(),
            name: c,
            type: g,
            emoji: y || "\u{1F3F7}\uFE0F",
            color: ht(E, k[r.categories.length % k.length]),
          };
          (r.categories.push(A), o.set(M, A));
        }
        return o.get(M);
      },
      l = (c, g) =>
        o.get(g + "|" + String(c).trim().toLowerCase()) ||
        o.get((g === "income" ? "expense" : "income") + "|" + String(c).trim().toLowerCase());
    for (let c of e.wallets || [])
      s(
        w(c, ["nama", "name"]),
        w(c, ["ikon", "emoji"]),
        w(c, ["saldoawal", "saldo", "initial"]),
        w(c, ["jenisdompet", "walletkind"]),
      );
    for (let c of e.cats || []) {
      let g = w(c, ["nama", "name"]);
      String(g).trim() &&
        u(
          g,
          fi(w(c, ["jenis", "tipe", "type"])) ? "income" : "expense",
          w(c, ["ikon", "emoji"]),
          w(c, ["warna", "color"]),
        );
    }
    let d = Date.now();
    (e.tx || []).forEach((c, g) => {
      let y = Zt(w(c, ["tanggal", "date"])),
        E = Math.abs(gt(w(c, ["nominal", "jumlah", "amount"])));
      if (!y || !E) {
        i++;
        return;
      }
      const transfer = /transfer|pindahantar|pindahdana/i.test(
        String(w(c, ["jenis", "tipe", "type"])),
      );
      if (transfer) {
        const source = s(w(c, ["dompet", "wallet", "akun"]));
        const destinationName = w(c, ["dompettujuan", "tujuan", "walletto"]);
        const destination = destinationName ? s(destinationName) : null;
        if (!destination || source.id === destination.id) {
          i++;
          return;
        }
        r.transactions.push({
          id: C(),
          type: "transfer",
          amount: E,
          feeAmount: Math.abs(gt(w(c, ["biayaadmin", "biaya", "fee"]))),
          walletId: source.id,
          toWalletId: destination.id,
          date: y,
          note: String(w(c, ["catatan", "note", "keterangan"])),
          ts: d - g,
        });
        return;
      }
      let M = fi(w(c, ["jenis", "tipe", "type"])) ? "income" : "expense",
        A = String(w(c, ["kategori", "category"])).trim(),
        X = (A && l(A, M)) || u(A, M),
        yi = s(w(c, ["dompet", "wallet", "akun"]));
      r.transactions.push({
        id: C(),
        type: M,
        amount: E,
        categoryId: X.id,
        walletId: yi.id,
        date: y,
        note: String(w(c, ["catatan", "note", "keterangan"])),
        ts: d - g,
      });
    });
    let p = new Map();
    for (let c of e.targets || []) {
      let g = String(w(c, ["nama", "name"])).trim(),
        y = gt(w(c, ["nominaltarget", "target", "nominal"]));
      if (!g || !y) {
        i++;
        continue;
      }
      let E = {
        id: C(),
        name: g,
        emoji: w(c, ["ikon", "emoji"]) || "\u{1F3AF}",
        target: y,
        deadline: Zt(w(c, ["tenggat", "deadline"])),
        color: ht(w(c, ["warna", "color"]), k[r.targets.length % k.length]),
        contribs: [],
      };
      (r.targets.push(E), p.set(g.toLowerCase(), E));
    }
    (e.contribs || []).forEach((c, g) => {
      let y = p.get(
          String(w(c, ["namatarget", "target", "nama"]))
            .trim()
            .toLowerCase(),
        ),
        E = Zt(w(c, ["tanggal", "date"])),
        M = Math.abs(gt(w(c, ["nominal", "jumlah"])));
      if (!y || !E || !M) {
        i++;
        return;
      }
      let A = String(w(c, ["dompet", "wallet"])).trim(),
        X = A ? a.get(A.toLowerCase()) : null;
      y.contribs.push({
        id: C(),
        type: Qs(w(c, ["jenis", "tipe", "type"])) ? "out" : "in",
        amount: M,
        walletId: X ? X.id : "",
        date: E,
        note: String(w(c, ["catatan", "note"])),
        ts: d - g,
      });
    });
    for (let c of e.budgets || []) {
      let g = l(w(c, ["kategori", "category"]), "expense"),
        y = gt(w(c, ["batasbulanan", "batas", "limit"]));
      g && g.type === "expense" && y > 0 && (r.budgets[g.id] = y);
    }
    let m = Ee(r);
    return {
      state: m,
      report: {
        transactions: m.transactions.length,
        targets: m.targets.length,
        wallets: m.wallets.length,
        categories: m.categories.length,
        skipped: i,
      },
    };
  }
  var Ae = null;
  function di() {
    return typeof window != "undefined" && window.XLSX
      ? Promise.resolve(window.XLSX)
      : (Ae ||
          (Ae = new Promise((t, e) => {
            let n = document.createElement("script");
            ((n.src = "assets/vendor/xlsx-0.18.5.min.js"),
              (n.onload = () => t(window.XLSX)),
              (n.onerror = () => {
                ((Ae = null), e(new Error("LIB")));
              }),
              document.head.appendChild(n));
          })),
        Ae);
  }
  function no(t, e) {
    let n = t.utils.book_new();
    for (let r of e) {
      let i = t.utils.aoa_to_sheet([r.head, ...r.rows]);
      i["!cols"] = r.widths.map((a) => ({ wch: a }));
      for (let a of r.money || [])
        for (let s = 1; s <= r.rows.length; s++) {
          let o = i[t.utils.encode_cell({ r: s, c: a })];
          o && o.t === "n" && (o.z = "#,##0");
        }
      (r.filter &&
        r.rows.length &&
        (i["!autofilter"] = {
          ref: t.utils.encode_range({
            s: { r: 0, c: 0 },
            e: { r: r.rows.length, c: r.head.length - 1 },
          }),
        }),
        t.utils.book_append_sheet(n, i, r.name));
    }
    return n;
  }
  async function hi(t, e = new Date()) {
    let n = await di(),
      r = to(t, e),
      i = n.write(no(n, r), { bookType: "xlsx", type: "array" }),
      a = new Blob([i], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      s = (o) => String(o).padStart(2, "0");
    return {
      blob: a,
      filename: `duitku-backup-${e.getFullYear()}-${s(e.getMonth() + 1)}-${s(e.getDate())}.xlsx`,
      sheets: r,
    };
  }
  function ro(t, e) {
    let n = t.read(e, { type: "array", cellDates: !0, sheetRows: 100001 }),
      r = new Map(n.SheetNames.map((i) => [i.trim().toLowerCase(), i]));
    return eo((i) => {
      let a = r.get(i.toLowerCase());
      return a ? t.utils.sheet_to_json(n.Sheets[a], { raw: !0, defval: "" }) : null;
    });
  }
  async function pi(t) {
    return window.DuitkuBackup.readFile(t, {
      normalizeJson: (n) => {
        let r = Ee(n),
          i =
            n.transactions.length +
            n.targets.reduce(
              (a, s) => a + (Array.isArray(s && s.contribs) ? s.contribs.length : 0),
              0,
            ),
          o = r.transactions.length + r.targets.reduce((a, s) => a + s.contribs.length, 0);
        return {
          state: r,
          report: {
            transactions: r.transactions.length,
            targets: r.targets.length,
            wallets: r.wallets.length,
            categories: r.categories.length,
            skipped: Math.max(0, i - o),
          },
        };
      },
      readWorkbook: async (n) => {
        let r = await di();
        return ro(r, n);
      },
    });
  }
  var { rp: Ct, compact: gi } = En,
    mi = new Map(),
    $ = (t, e, n) => {
      let r = e.join("|"),
        i = mi.get(t);
      if (i && i.key === r) return i.val;
      let a = n();
      return (mi.set(t, { key: r, val: a }), a);
    },
    _i = (t, e) =>
      e.date.localeCompare(t.date) || (e.ts || 0) - (t.ts || 0) || e.id.localeCompare(t.id),
    ao = ["home", "tx", "targets", "report", "settings"];
  function so(t, e) {
    window.DuitkuBackup.download(t, e);
  }
  function Cn() {
    return {
      state: ne(),
      rev: 0,
      ready: !1,
      tab: "home",
      month: D(new Date()),
      year: new Date().getFullYear(),
      repMode: "month",
      reportDate: U(new Date()),
      ySelIndex: null,
      selDay: null,
      sheet: !1,
      form: {},
      formError: "",
      search: "",
      typeFilter: "all",
      txPage: 0,
      txPageSize: 50,
      toast: "",
      busy: "",
      newWallet: { kind: "cash", name: "", initial: "" },
      newCat: { emoji: "\u{1F3F7}\uFE0F", name: "", type: "expense" },
      detailId: null,
      tSheet: !1,
      tf: {},
      tError: "",
      cSheet: !1,
      cf: {},
      cError: "",
      cb: { open: !1, title: "", text: "", ok: "Ya", danger: !1, res: null },
      presets: [
        { emoji: "\u{1F6DF}", name: "Dana darurat" },
        { emoji: "\u{1F48D}", name: "Dana pernikahan", color: "#FF5FA2" },
        { emoji: "\u2708\uFE0F", name: "Liburan" },
        { emoji: "\u{1F4F1}", name: "Gadget" },
        { emoji: "\u{1F3E0}", name: "DP rumah" },
        { emoji: "\u{1F6F5}", name: "Kendaraan" },
      ],
      rp: Ct,
      compact: gi,
      dateShort: Xt,
      dateLong: ve,
      grapheme: L,
      async init() {
        let t = !1;
        try {
          t = localStorage.getItem(Ot.key) === null;
        } catch {}
        ((this.state = await Ot.load()),
          this.rev++,
          t &&
            (this.state.dark = !!(
              window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches
            )),
          this.applyTheme(),
          this.resetForm(),
          this.route(),
          window.addEventListener("hashchange", () => this.route()),
          window.addEventListener("storage", (e) => {
            e.key === Ot.key &&
              Ot.load().then((n) => {
                ((this.state = n), this.rev++, this.applyTheme());
              });
          }),
          this.$watch("anyOpen", (e) => document.body.classList.toggle("lock", e)),
          (this.ready = !0));
      },
      persist() {
        (this.rev++,
          Ot.save(this.state).then((t) => {
            !t &&
              !this._warned &&
              ((this._warned = !0),
              this.say("Browser tidak bisa menyimpan data. Aktifkan penyimpanan situs."));
          }));
      },
      say(t) {
        ((this.toast = t),
          clearTimeout(this._t),
          (this._t = setTimeout(() => (this.toast = ""), 2600)));
      },
      applyTheme() {
        document.documentElement.classList.toggle("dark", !!this.state.dark);
        let t = document.querySelector('meta[name="theme-color"]:not([media])');
        t && t.setAttribute("content", this.state.dark ? "#0E0C17" : "#F5F2FF");
      },
      toggleDark() {
        ((this.state.dark = !this.state.dark), this.applyTheme(), this.persist());
      },
      toggleHide() {
        ((this.state.hideBalance = !this.state.hideBalance), this.persist());
      },
      hide(t) {
        return this.state.hideBalance ? "Rp \u2022\u2022\u2022\u2022\u2022\u2022" : t;
      },
      route() {
        let t = location.hash.replace(/^#\/?/, "");
        ((this.tab = ao.includes(t) ? t : "home"), window.scrollTo(0, 0));
        if (this.tab === "tx") this.txPage = 0;
      },
      go(t) {
        if (this.tab === t) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        location.hash = "#/" + t;
      },
      get anyOpen() {
        return !!(this.sheet || this.detailId || this.tSheet || this.cSheet || this.cb.open);
      },
      closeTop() {
        if (this.cb.open) return this.answer(!1);
        this.cSheet
          ? (this.cSheet = !1)
          : this.tSheet
            ? (this.tSheet = !1)
            : this.detailId
              ? (this.detailId = null)
              : this.sheet && (this.sheet = !1);
      },
      ask({ title: t, text: e = "", ok: n = "Ya", danger: r = !1 }) {
        return new Promise((i) => {
          this.cb = { open: !0, title: t, text: e, ok: n, danger: r, res: i };
        });
      },
      answer(t) {
        let e = this.cb.res;
        ((this.cb = { ...this.cb, open: !1, res: null }), e && e(t));
      },
      get initial() {
        return L(this.state.name, "K").toUpperCase();
      },
      get greeting() {
        let t = new Date().getHours();
        return t < 11
          ? "Selamat pagi"
          : t < 15
            ? "Selamat siang"
            : t < 18
              ? "Selamat sore"
              : "Selamat malam";
      },
      get monthLabel() {
        return Sn(this.month);
      },
      get monthLabelLong() {
        return kn(this.month);
      },
      shift(t) {
        ((this.month = Gt(this.month, t)), (this.selDay = null), (this.txPage = 0));
      },
      shiftYear(t) {
        ((this.year += t), (this.ySelIndex = null));
      },
      catOf(t) {
        return (
          this.state.categories.find((e) => e.id === t) || {
            id: "x",
            name: "Lainnya",
            emoji: "\u2728",
            color: "#94A3B8",
            type: "expense",
          }
        );
      },
      walletOf(t) {
        return this.state.wallets.find((e) => e.id === t) || { name: "-", emoji: "\u{1F4B3}" };
      },
      walletName(t) {
        const wallet = typeof t === "string" ? this.walletOf(t) : t;
        return `${wallet.emoji} ${wallet.name}`;
      },
      walletMark(t) {
        return window.DuitkuWallets.kinds.find((kind) => kind.id === t.kind)?.mark || "BK";
      },
      walletColor(t) {
        return window.DuitkuWallets.kinds.find((kind) => kind.id === t.kind)?.color || "#2866C5";
      },
      walletKindLabel(t) {
        return window.DuitkuWallets.kinds.find((kind) => kind.id === t.kind)?.name || "Bank";
      },
      changeWalletKind() {
        if (!["cash", "bank", "ewallet"].includes(this.newWallet.kind)) {
          this.newWallet.kind = "cash";
        }
      },
      get expenseCats() {
        return this.state.categories.filter((t) => t.type === "expense");
      },
      get formCats() {
        return this.state.categories.filter((t) => t.type === this.form.type);
      },
      get reportBounds() {
        const selected = new Date(`${this.reportDate}T00:00:00`);
        if (this.repMode === "day") return [this.reportDate, this.reportDate];
        if (this.repMode === "week") {
          const mondayOffset = (selected.getDay() + 6) % 7;
          const start = new Date(selected);
          start.setDate(selected.getDate() - mondayOffset);
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          return [U(start), U(end)];
        }
        const monthStart = `${this.reportDate.slice(0, 7)}-01`;
        const monthEnd = `${this.reportDate.slice(0, 7)}-${String(pt(this.reportDate.slice(0, 7))).padStart(2, "0")}`;
        return [monthStart, monthEnd];
      },
      get reportRangeLabel() {
        const [start, end] = this.reportBounds;
        return start === end ? Xt(start) : `${Xt(start)} – ${Xt(end)}`;
      },
      get rangeStats() {
        return window.DuitkuFinance.summarizeRange(this.state, ...this.reportBounds);
      },
      get rangeDays() {
        return window.DuitkuFinance.dailyRange(this.state, ...this.reportBounds);
      },
      rangeBarWidth(amount) {
        const max = Math.max(1, ...this.rangeDays.flatMap((day) => [day.income, day.expense]));
        return Math.max(0, (amount / max) * 100);
      },
      shiftReportDate(offset) {
        const selected = new Date(`${this.reportDate}T00:00:00`);
        selected.setDate(selected.getDate() + offset * (this.repMode === "week" ? 7 : 1));
        this.reportDate = U(selected);
      },
      get mStats() {
        return $("m", [this.month, this.rev], () => mt(this.state, this.month));
      },
      get pStats() {
        return $("p", [this.month, this.rev], () => mt(this.state, Gt(this.month, -1)));
      },
      get deltas() {
        return $("d", [this.month, this.rev], () => {
          let t = mt(this.state, this.month),
            e = mt(this.state, Gt(this.month, -1)),
            n = (r, i, a) => {
              let s = oi(r, i);
              if (s === null) return { text: "Belum ada pembanding", cls: "opacity-60", icon: "" };
              if (Math.abs(s) < 0.5)
                return { text: "Sama seperti bulan lalu", cls: "opacity-60", icon: "" };
              let o = s >= 0;
              return {
                text: `${o ? "Naik" : "Turun"} ${Math.round(Math.abs(s))}% dari bulan lalu`,
                cls: o === a ? "t-inc" : "t-exp",
                icon: o ? "trending-up" : "trending-down",
              };
            };
          return {
            income: n(t.income, e.income, !0),
            expense: n(t.expense, e.expense, !1),
            net: n(t.net, e.net, !0),
            saved: n(t.saved, e.saved, !0),
          };
        });
      },
      get monthTx() {
        return $("mtx", [this.month, this.rev], () =>
          this.state.transactions.filter((t) => t.date.startsWith(this.month)).sort(_i),
        );
      },
      get transactionSearchIndex() {
        return $("tx-search", [this.month, this.rev], () =>
          window.DuitkuFinance.indexTransactions(
            this.monthTx,
            this.state.categories,
            this.state.wallets,
          ),
        );
      },
      get recentTx() {
        return this.monthTx.slice(0, 5);
      },
      get filteredTx() {
        return window.DuitkuFinance.filterIndexedTransactions(
          this.transactionSearchIndex,
          this.search,
          this.typeFilter,
        );
      },
      get filteredTotals() {
        let t = 0,
          e = 0;
        for (let n of this.filteredTx) {
          if (n.type === "income") t += n.amount;
          else if (n.type === "expense") e += n.amount;
          else if (n.type === "transfer") e += Number(n.feeAmount) || 0;
        }
        return { inc: t, exp: e };
      },
      get txPageCount() {
        return Math.max(1, Math.ceil(this.filteredTx.length / this.txPageSize));
      },
      previousTxPage() {
        this.txPage = Math.max(0, this.txPage - 1);
      },
      nextTxPage() {
        this.txPage = Math.min(this.txPageCount - 1, this.txPage + 1);
      },
      get grouped() {
        let t = new Map();
        let startIndex = this.txPage * this.txPageSize;
        for (let r of this.filteredTx.slice(startIndex, startIndex + this.txPageSize))
          (t.has(r.date) || t.set(r.date, []), t.get(r.date).push(r));
        let e = this.todayStr,
          n = this.yesterdayStr;
        return [...t.entries()].map(([r, i]) => ({
          date: r,
          items: i,
          label: r === e ? "Hari ini" : r === n ? "Kemarin" : ve(r),
          total: i.reduce(
            (a, s) =>
              a +
              (s.type === "income"
                ? s.amount
                : s.type === "expense"
                  ? -s.amount
                  : -(Number(s.feeAmount) || 0)),
            0,
          ),
        }));
      },
      get catStats() {
        return $("cat", [this.month, this.rev], () => Se(this.state, this.month));
      },
      get donut() {
        let t = 0,
          e = this.catStats.map((n) => {
            let r = t;
            return ((t += n.pct), `${n.cat.color} ${r}% ${Math.min(100, t)}%`);
          });
        return e.length ? `conic-gradient(${e.join(",")})` : "var(--track)";
      },
      ringStyle(t, e = "var(--inc)") {
        let n = t === null ? 0 : Math.max(0, Math.min(1, t));
        return `background:conic-gradient(${e} ${n * 360}deg, var(--track) 0)`;
      },
      get rateMsg() {
        let t = this.mStats.rate;
        return t === null
          ? this.mStats.expense
            ? "Belum ada pemasukan bulan ini."
            : "Catat transaksi pertamamu untuk mulai menghitung."
          : t < 0
            ? "Pengeluaran melebihi pemasukan bulan ini."
            : t >= 0.2
              ? "Di atas patokan 20%. Pertahankan."
              : "Naikkan sedikit untuk mencapai patokan 20%.";
      },
      get trend() {
        return $("trend", [this.month, this.rev], () =>
          window.DuitkuFinance.weeklyExpenses(this.state, this.month),
        );
      },
      walletBalance(t) {
        return window.DuitkuFinance.walletBalance(this.state, t);
      },
      get totalBalance() {
        return $("bal", [this.rev], () =>
          this.state.wallets.reduce((t, e) => t + this.walletBalance(e), 0),
        );
      },
      budgetRow(t) {
        var r;
        let e = Number(this.state.budgets[t]) || 0;
        if (!e) return null;
        let n = ((r = this.catStats.find((i) => i.cat.id === t)) == null ? void 0 : r.total) || 0;
        return { limit: e, spent: n, pct: (n / e) * 100 };
      },
      get budgetRows() {
        return this.expenseCats
          .map((t) => ({ cat: t, ...(this.budgetRow(t.id) || {}) }))
          .filter((t) => t.limit);
      },
      budgetInput(t) {
        let e = Number(this.state.budgets[t]) || 0;
        return e ? Et(e) : "";
      },
      setBudget(t, e) {
        let n = Number(String(e).replace(/\D/g, "")) || 0;
        (n ? (this.state.budgets[t] = n) : delete this.state.budgets[t], this.persist());
      },
      get safePerDay() {
        if (this.month !== D(new Date())) return null;
        let t = this.budgetRows.reduce((r, i) => r + i.limit, 0);
        if (!t) return null;
        let e = new Date(),
          n = pt(this.month) - e.getDate() + 1;
        return (t - this.budgetRows.reduce((r, i) => r + i.spent, 0)) / n;
      },
      get daily() {
        return $("daily", [this.month, this.rev], () => ui(this.state, this.month));
      },
      get dayInfo() {
        let t = this.selDay ? this.daily.days[this.selDay - 1] : this.daily.top;
        return t
          ? `${this.selDay ? "Tanggal" : "Terboros: tanggal"} ${t.day} \xB7 ${Ct(t.total)}`
          : "Belum ada pengeluaran";
      },
      get avgPerDay() {
        let t = new Date(),
          e = this.month === D(t) ? t.getDate() : this.month > D(t) ? 1 : pt(this.month);
        return this.mStats.expense / Math.max(1, e);
      },
      get topTx() {
        return $("top", [this.month, this.rev], () => li(this.state, this.month, 5));
      },
      get yStats() {
        return $("y", [this.year, this.rev], () => An(this.state, this.year));
      },
      get yCats() {
        return $("ycat", [this.year, this.rev], () => Se(this.state, String(this.year)));
      },
      get yInsights() {
        return $("yins", [this.year, this.rev], () =>
          ci(An(this.state, this.year), Se(this.state, String(this.year))),
        );
      },
      get ySel() {
        let t = this.yStats,
          e = this.ySelIndex;
        if (e === null) {
          let n = new Date();
          e =
            t.year === n.getFullYear()
              ? n.getMonth()
              : Math.max(0, t.months.map((r) => r.active).lastIndexOf(!0));
        }
        return t.months[e];
      },
      barH(t) {
        return t > 0 ? Math.max(3, (t / this.yStats.maxValue) * 100) : 0;
      },
      openMonth(t) {
        ((this.month = t),
          (this.repMode = "month"),
          (this.selDay = null),
          window.scrollTo({ top: 0, behavior: "smooth" }));
      },
      rateText(t) {
        return t === null ? "-" : Math.round(t * 100) + "%";
      },
      signed(t) {
        return (t < 0 ? "-" : "") + gi(Math.abs(t));
      },
      targetSaved(t) {
        return window.DuitkuFinance.targetSaved(t);
      },
      targetPct(t) {
        return t.target ? Math.min(100, Math.max(0, (this.targetSaved(t) / t.target) * 100)) : 0;
      },
      get totalSaved() {
        return this.state.targets.reduce((t, e) => t + this.targetSaved(e), 0);
      },
      get totalTarget() {
        return this.state.targets.reduce((t, e) => t + (Number(e.target) || 0), 0);
      },
      get detailT() {
        return this.state.targets.find((t) => t.id === this.detailId) || null;
      },
      ring(t) {
        return `background:conic-gradient(${t.color} ${this.targetPct(t) * 3.6}deg, var(--track) 0)`;
      },
      daysLeft(t) {
        if (!t.deadline) return null;
        let e = new Date();
        return (e.setHours(0, 0, 0, 0), Math.round((Mt(t.deadline) - e) / 864e5));
      },
      deadlineText(t) {
        let e = this.daysLeft(t);
        return e === null
          ? "Tanpa tenggat"
          : e < 0
            ? `Lewat ${-e} hari dari tenggat`
            : e === 0
              ? "Tenggat hari ini"
              : (e >= 60 ? Math.round(e / 30.44) + " bulan lagi" : e + " hari lagi") +
                " \xB7 " +
                Xt(t.deadline);
      },
      needText(t) {
        let e = Math.max(0, t.target - this.targetSaved(t));
        if (!e) return "Target tercapai \u{1F389}";
        let n = this.daysLeft(t);
        return n === null
          ? "Sisa " + Ct(e)
          : n <= 0
            ? "Sisa " + Ct(e) + ", tenggat terlewat"
            : "Sisihkan " + Ct(e / Math.max(1, Math.ceil(n / 30.44))) + " per bulan";
      },
      sortedContribs(t) {
        return [...t.contribs].sort(_i);
      },
      openDetail(t) {
        this.detailId = t.id;
      },
      openTargetForm(t) {
        ((this.tError = ""),
          (this.tf = t
            ? {
                id: t.id,
                name: t.name,
                emoji: t.emoji,
                target: Et(t.target),
                deadline: t.deadline || "",
                color: t.color,
              }
            : {
                id: null,
                name: "",
                emoji: "\u{1F3AF}",
                target: "",
                deadline: "",
                color: k[this.state.targets.length % k.length],
              }),
          (this.tSheet = !0));
      },
      applyPreset(t) {
        ((this.tf.name = t.name), (this.tf.emoji = t.emoji), t.color && (this.tf.color = t.color));
      },
      saveTarget() {
        let t = Number(String(this.tf.target).replace(/\D/g, "")),
          e = this.tf.name.trim();
        if (!e) return (this.tError = "Isi nama target dulu ya.");
        if (!t) return (this.tError = "Isi nominal target.");
        if (
          this.state.targets.some(
            (r) => r.id !== this.tf.id && r.name.toLowerCase() === e.toLowerCase(),
          )
        )
          return (this.tError = "Nama target sudah dipakai.");
        let n = L(this.tf.emoji, "\u{1F3AF}");
        (this.tf.id
          ? Object.assign(
              this.state.targets.find((r) => r.id === this.tf.id),
              { name: e, emoji: n, target: t, deadline: this.tf.deadline },
            )
          : this.state.targets.push({
              id: C(),
              name: e,
              emoji: n,
              target: t,
              deadline: this.tf.deadline,
              color: this.tf.color,
              contribs: [],
            }),
          this.persist(),
          (this.tSheet = !1),
          this.say("Target tersimpan"));
      },
      async delTarget() {
        let t = this.state.targets.find((e) => e.id === this.tf.id);
        t &&
          (await this.ask({
            title: `Hapus target "${t.name}"?`,
            text: "Riwayat setorannya ikut terhapus dan saldo dompet dikembalikan.",
            ok: "Hapus",
            danger: !0,
          })) &&
          ((this.state.targets = this.state.targets.filter((e) => e.id !== t.id)),
          this.persist(),
          (this.tSheet = !1),
          (this.detailId = null),
          this.say("Target dihapus"));
      },
      openContrib(t, e) {
        var n;
        ((this.cError = ""),
          (this.cf = {
            targetId: t.id,
            targetName: t.emoji + " " + t.name,
            type: e,
            amount: "",
            walletId: ((n = this.state.wallets[0]) == null ? void 0 : n.id) || "",
            date: U(new Date()),
            note: "",
          }),
          (this.cSheet = !0));
      },
      saveContrib() {
        let t = Number(String(this.cf.amount).replace(/\D/g, ""));
        if (!t) return (this.cError = "Isi nominalnya dulu ya.");
        if (!this.cf.date) return (this.cError = "Pilih tanggal.");
        let e = this.state.targets.find((n) => n.id === this.cf.targetId);
        if (this.cf.type === "out" && t > this.targetSaved(e))
          return (this.cError = "Penarikan melebihi dana terkumpul.");
        (e.contribs.push({
          id: C(),
          type: this.cf.type,
          amount: t,
          walletId: this.cf.walletId,
          date: this.cf.date,
          note: this.cf.note.trim(),
          ts: Date.now(),
        }),
          this.persist(),
          (this.cSheet = !1),
          this.say(this.cf.type === "in" ? "Setoran tersimpan" : "Penarikan tersimpan"));
      },
      async delContrib(t, e) {
        (await this.ask({
          title: "Hapus catatan ini?",
          text: `${e.type === "in" ? "Setoran" : "Penarikan"} ${Ct(e.amount)} akan dihapus.`,
          ok: "Hapus",
          danger: !0,
        })) && ((t.contribs = t.contribs.filter((n) => n.id !== e.id)), this.persist());
      },
      fmtInput(t) {
        let e = String(t).replace(/\D/g, "");
        return e ? Et(Number(e)) : "";
      },
      resetForm() {
        var t;
        ((this.form = {
          id: null,
          type: "expense",
          amount: "",
          categoryId: "",
          walletId: ((t = this.state.wallets[0]) == null ? void 0 : t.id) || "",
          toWalletId:
            (this.state.wallets.find((e) => e.id !== this.state.wallets[0]?.id) || {}).id || "",
          feeAmount: "",
          date: U(new Date()),
          note: "",
          ts: 0,
        }),
          (this.formError = ""));
      },
      openAdd() {
        (this.resetForm(),
          this.setType("expense"),
          (this.sheet = !0),
          this.$nextTick(() => {
            var t;
            return (t = this.$refs.amount) == null ? void 0 : t.focus();
          }));
      },
      openEdit(t) {
        ((this.form = {
          ...t,
          amount: Et(t.amount),
          feeAmount: t.feeAmount ? Et(t.feeAmount) : "",
        }),
          (this.formError = ""),
          (this.sheet = !0));
      },
      setType(t) {
        var e;
        this.form.type = t;
        if (t === "transfer") {
          this.form.categoryId = "";
          this.form.toWalletId =
            this.state.wallets.find((wallet) => wallet.id !== this.form.walletId)?.id || "";
          return;
        }
        this.form.categoryId =
          ((e = this.state.categories.find((n) => n.type === t)) == null ? void 0 : e.id) || "";
      },
      get todayStr() {
        return U(new Date());
      },
      get yesterdayStr() {
        let t = new Date();
        return (t.setDate(t.getDate() - 1), U(t));
      },
      setDate(t) {
        this.form.date = t === "yesterday" ? this.yesterdayStr : this.todayStr;
      },
      saveTx() {
        let t = window.DuitkuFinance.saveTransaction(this.state.transactions, this.form, {
          createId: C,
          isValidDate: J,
        });
        if (t.error) {
          this.formError = t.error;
          return;
        }
        ((this.state.transactions = t.transactions),
          (this.month = t.month),
          (this.txPage = 0),
          this.persist(),
          (this.sheet = !1),
          this.say(t.isEdit ? "Perubahan disimpan" : "Transaksi tersimpan"));
      },
      async removeTx() {
        if (
          !(await this.ask({
            title: "Hapus transaksi ini?",
            text: "Tindakan ini tidak bisa dibatalkan.",
            ok: "Hapus",
            danger: !0,
          }))
        )
          return;
        ((this.state.transactions = window.DuitkuFinance.removeTransaction(
          this.state.transactions,
          this.form.id,
        )),
          (this.txPage = 0),
          this.persist(),
          (this.sheet = !1),
          this.say("Transaksi dihapus"));
      },
      addWallet() {
        let t = this.newWallet.name.trim();
        if (!t) return this.say("Isi nama dompet dulu");
        if (this.state.wallets.some((e) => e.name.toLowerCase() === t.toLowerCase()))
          return this.say("Nama dompet sudah dipakai");
        (this.state.wallets.push({
          id: C(),
          name: t,
          emoji:
            this.newWallet.kind === "cash"
              ? "\u{1F4B5}"
              : this.newWallet.kind === "bank"
                ? "\u{1F3E6}"
                : "\u{1F4F1}",
          kind: this.newWallet.kind,
          initial: Number(String(this.newWallet.initial).replace(/\D/g, "")) || 0,
        }),
          (this.newWallet = { kind: "cash", name: "", initial: "" }),
          this.persist(),
          this.say("Dompet ditambahkan"));
      },
      async delWallet(t) {
        if (this.state.wallets.length <= 1) return this.say("Minimal harus ada 1 dompet");
        if (
          this.state.transactions.some(
            (e) => e.walletId === t.id || (e.type === "transfer" && e.toWalletId === t.id),
          ) ||
          this.state.targets.some((e) => e.contribs.some((n) => n.walletId === t.id))
        )
          return this.say("Dompet masih dipakai transaksi");
        (await this.ask({ title: `Hapus dompet ${t.name}?`, ok: "Hapus", danger: !0 })) &&
          ((this.state.wallets = this.state.wallets.filter((e) => e.id !== t.id)), this.persist());
      },
      addCat() {
        let t = this.newCat.name.trim();
        if (!t) return this.say("Isi nama kategori dulu");
        if (
          this.state.categories.some(
            (e) => e.type === this.newCat.type && e.name.toLowerCase() === t.toLowerCase(),
          )
        )
          return this.say("Nama kategori sudah dipakai");
        (this.state.categories.push({
          id: C(),
          name: t,
          emoji: L(this.newCat.emoji, "\u{1F3F7}\uFE0F"),
          type: this.newCat.type,
          color: k[this.state.categories.length % k.length],
        }),
          (this.newCat = { emoji: "\u{1F3F7}\uFE0F", name: "", type: "expense" }),
          this.persist(),
          this.say("Kategori ditambahkan"));
      },
      async delCat(t) {
        if (this.state.transactions.some((e) => e.categoryId === t.id))
          return this.say("Kategori masih dipakai transaksi");
        if (this.state.categories.filter((e) => e.type === t.type).length <= 1)
          return this.say("Minimal harus ada 1 kategori per jenis");
        (await this.ask({ title: `Hapus kategori ${t.name}?`, ok: "Hapus", danger: !0 })) &&
          ((this.state.categories = this.state.categories.filter((e) => e.id !== t.id)),
          delete this.state.budgets[t.id],
          this.persist());
      },
      get dataSummary() {
        return `${this.state.transactions.length} transaksi \xB7 ${this.state.targets.length} target \xB7 ${this.state.wallets.length} dompet`;
      },
      get lastExportText() {
        return this.state.lastExport
          ? "Terakhir diekspor " + Xt(U(new Date(this.state.lastExport)))
          : "Belum pernah diekspor";
      },
      libError(t) {
        return t && t.message === "LIB"
          ? "Library Excel gagal dimuat. Cek koneksi lalu coba lagi."
          : null;
      },
      async exportJSON() {
        if (!this.busy) {
          this.busy = "json-export";
          try {
            let t = window.DuitkuBackup.exportJSON(this.state);
            (so(t.blob, t.filename), this.say("JSON backup berhasil diekspor"));
          } catch (t) {
            (console.warn(t), this.say("Ekspor backup JSON gagal. Coba lagi."));
          } finally {
            this.busy = "";
          }
        }
      },
      async exportExcel() {
        if (!this.busy) {
          this.busy = "export";
          try {
            let { blob: t, filename: e, sheets: n } = await hi(this.state);
            (so(t, e),
              (this.state.lastExport = new Date().toISOString()),
              this.persist(),
              this.say(
                `Excel diekspor: ${n[0].rows.length} transaksi, ${this.state.targets.length} target`,
              ));
          } catch (t) {
            (console.warn(t), this.say(this.libError(t) || "Ekspor gagal. Coba lagi."));
          } finally {
            this.busy = "";
          }
        }
      },
      async importBackup(t) {
        let e = t.target.files[0];
        if (((t.target.value = ""), !(!e || this.busy))) {
          this.busy = "import";
          try {
            let { state: n, report: r, format: i } = await pi(e);
            this.busy = "";
            if (
              !(await this.ask({
                title: "Pulihkan backup ini?",
                text: `Format ${i}. Berisi ${r.transactions} transaksi, ${r.targets} target, ${r.wallets} dompet, dan ${r.categories} kategori.${r.transactions + r.targets === 0 ? " Backup ini tidak berisi transaksi atau target." : ""} Data yang ada sekarang akan diganti.${r.skipped ? ` ${r.skipped} baris tidak valid dilewati.` : ""}`,
                ok: "Pulihkan",
                danger: !0,
              }))
            )
              return;
            if (!(await Ot.save(n))) {
              this.say("Backup tidak dipulihkan karena data gagal disimpan.");
              return;
            }
            ((this.state = n),
              this.rev++,
              this.applyTheme(),
              (this.month = D(new Date())),
              this.say("Backup dipulihkan"));
          } catch (n) {
            (console.warn(n),
              this.say(
                this.libError(n) ||
                  (n && n.message === "FORMAT"
                    ? "File bukan backup Duitku yang valid. Pilih file Excel hasil ekspor Duitku atau backup JSON Duitku."
                    : n && n.message === "BESAR"
                      ? "File terlalu besar (maks. 15 MB)."
                      : "File tidak bisa dibaca."),
              ));
          } finally {
            this.busy = "";
          }
        }
      },
      async resetAll() {
        if (
          !(await this.ask({
            title: "Hapus semua data?",
            text: "Semua transaksi, target, dompet, kategori, dan anggaran dihapus permanen. Ekspor ke Excel dulu bila masih perlu.",
            ok: "Hapus semua",
            danger: !0,
          }))
        )
          return;
        let e = this.state.dark;
        ((this.state = ne()),
          (this.state.dark = e),
          this.persist(),
          this.resetForm(),
          this.say("Semua data dihapus"));
      },
    };
  }
  window.Alpine = we;
  we.data("app", Cn);
  we.start();
  "serviceWorker" in navigator &&
    /^https?:$/.test(location.protocol) &&
    window.addEventListener("load", () =>
      navigator.serviceWorker.register("sw.js").catch(() => {}),
    );
})();
