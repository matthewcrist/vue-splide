(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("vue")) : typeof define === "function" && define.amd ? define(["exports", "vue"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.VueSplide = {}, global.Vue));
})(this, function(exports2, vue) {
  "use strict";
  /*!
   * Splide.js
   * Version  : 3.1.7
   * License  : MIT
   * Copyright: 2021 Naotoshi Fujita
   */
  const PROJECT_CODE = "splide";
  const DATA_ATTRIBUTE = `data-${PROJECT_CODE}`;
  const CREATED = 1;
  const MOUNTED = 2;
  const IDLE = 3;
  const MOVING = 4;
  const DESTROYED = 5;
  const STATES = {
    CREATED,
    MOUNTED,
    IDLE,
    MOVING,
    DESTROYED
  };
  const DEFAULT_EVENT_PRIORITY = 10;
  const DEFAULT_USER_EVENT_PRIORITY = 20;
  function empty(array) {
    array.length = 0;
  }
  function isObject$1(subject) {
    return !isNull(subject) && typeof subject === "object";
  }
  function isArray(subject) {
    return Array.isArray(subject);
  }
  function isFunction(subject) {
    return typeof subject === "function";
  }
  function isString(subject) {
    return typeof subject === "string";
  }
  function isUndefined(subject) {
    return typeof subject === "undefined";
  }
  function isNull(subject) {
    return subject === null;
  }
  function isHTMLElement(subject) {
    return subject instanceof HTMLElement;
  }
  function toArray(value) {
    return isArray(value) ? value : [value];
  }
  function forEach(values, iteratee) {
    toArray(values).forEach(iteratee);
  }
  function includes(array, value) {
    return array.indexOf(value) > -1;
  }
  function push(array, items) {
    array.push(...toArray(items));
    return array;
  }
  const arrayProto = Array.prototype;
  function slice(arrayLike, start, end) {
    return arrayProto.slice.call(arrayLike, start, end);
  }
  function find(arrayLike, predicate) {
    return slice(arrayLike).filter(predicate)[0];
  }
  function toggleClass(elm, classes, add) {
    if (elm) {
      forEach(classes, (name) => {
        if (name) {
          elm.classList[add ? "add" : "remove"](name);
        }
      });
    }
  }
  function addClass(elm, classes) {
    toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
  }
  function append(parent, children2) {
    forEach(children2, parent.appendChild.bind(parent));
  }
  function before(nodes, ref) {
    forEach(nodes, (node) => {
      const parent = ref.parentNode;
      if (parent) {
        parent.insertBefore(node, ref);
      }
    });
  }
  function matches(elm, selector) {
    return (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
  }
  function children(parent, selector) {
    return parent ? slice(parent.children).filter((child2) => matches(child2, selector)) : [];
  }
  function child(parent, selector) {
    return selector ? children(parent, selector)[0] : parent.firstElementChild;
  }
  function forOwn$1(object, iteratee) {
    if (object) {
      const keys = Object.keys(object);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== "__proto__") {
          if (iteratee(object[key], key) === false) {
            break;
          }
        }
      }
    }
    return object;
  }
  function assign(object) {
    slice(arguments, 1).forEach((source) => {
      forOwn$1(source, (value, key) => {
        object[key] = source[key];
      });
    });
    return object;
  }
  function merge$1(object, source) {
    forOwn$1(source, (value, key) => {
      if (isArray(value)) {
        object[key] = value.slice();
      } else if (isObject$1(value)) {
        object[key] = merge$1(isObject$1(object[key]) ? object[key] : {}, value);
      } else {
        object[key] = value;
      }
    });
    return object;
  }
  function removeAttribute(elm, attrs) {
    if (elm) {
      forEach(attrs, (attr) => {
        elm.removeAttribute(attr);
      });
    }
  }
  function setAttribute(elm, attrs, value) {
    if (isObject$1(attrs)) {
      forOwn$1(attrs, (value2, name) => {
        setAttribute(elm, name, value2);
      });
    } else {
      isNull(value) ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
    }
  }
  function create(tag, attrs, parent) {
    const elm = document.createElement(tag);
    if (attrs) {
      isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
    }
    parent && append(parent, elm);
    return elm;
  }
  function style(elm, prop, value) {
    if (isUndefined(value)) {
      return getComputedStyle(elm)[prop];
    }
    if (!isNull(value)) {
      const { style: style2 } = elm;
      value = `${value}`;
      if (style2[prop] !== value) {
        style2[prop] = value;
      }
    }
  }
  function display(elm, display2) {
    style(elm, "display", display2);
  }
  function focus(elm) {
    elm["setActive"] && elm["setActive"]() || elm.focus({ preventScroll: true });
  }
  function getAttribute(elm, attr) {
    return elm.getAttribute(attr);
  }
  function hasClass(elm, className) {
    return elm && elm.classList.contains(className);
  }
  function rect(target) {
    return target.getBoundingClientRect();
  }
  function remove(nodes) {
    forEach(nodes, (node) => {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  }
  function measure(parent, value) {
    if (isString(value)) {
      const div = create("div", { style: `width: ${value}; position: absolute;` }, parent);
      value = rect(div).width;
      remove(div);
    }
    return value;
  }
  function parseHtml(html) {
    return child(new DOMParser().parseFromString(html, "text/html").body);
  }
  function prevent(e, stopPropagation) {
    e.preventDefault();
    if (stopPropagation) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  function query(parent, selector) {
    return parent && parent.querySelector(selector);
  }
  function queryAll(parent, selector) {
    return slice(parent.querySelectorAll(selector));
  }
  function removeClass(elm, classes) {
    toggleClass(elm, classes, false);
  }
  function unit(value) {
    return isString(value) ? value : value ? `${value}px` : "";
  }
  function assert(condition, message = "") {
    if (!condition) {
      throw new Error(`[${PROJECT_CODE}] ${message}`);
    }
  }
  function nextTick(callback) {
    setTimeout(callback);
  }
  const noop = () => {
  };
  function raf(func) {
    return requestAnimationFrame(func);
  }
  const { min, max, floor, ceil, abs } = Math;
  function approximatelyEqual(x, y, epsilon) {
    return abs(x - y) < epsilon;
  }
  function between(number, minOrMax, maxOrMin, exclusive) {
    const minimum = min(minOrMax, maxOrMin);
    const maximum = max(minOrMax, maxOrMin);
    return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
  }
  function clamp(number, x, y) {
    const minimum = min(x, y);
    const maximum = max(x, y);
    return min(max(minimum, number), maximum);
  }
  function sign(x) {
    return +(x > 0) - +(x < 0);
  }
  function format(string, replacements) {
    forEach(replacements, (replacement) => {
      string = string.replace("%s", `${replacement}`);
    });
    return string;
  }
  function pad(number) {
    return number < 10 ? `0${number}` : `${number}`;
  }
  const ids = {};
  function uniqueId(prefix) {
    return `${prefix}${pad(ids[prefix] = (ids[prefix] || 0) + 1)}`;
  }
  function EventBus() {
    let handlers = {};
    function on(events, callback, key, priority = DEFAULT_EVENT_PRIORITY) {
      forEachEvent(events, (event, namespace) => {
        handlers[event] = handlers[event] || [];
        push(handlers[event], {
          _event: event,
          _callback: callback,
          _namespace: namespace,
          _priority: priority,
          _key: key
        }).sort((handler1, handler2) => handler1._priority - handler2._priority);
      });
    }
    function off(events, key) {
      forEachEvent(events, (event, namespace) => {
        const eventHandlers = handlers[event];
        handlers[event] = eventHandlers && eventHandlers.filter((handler) => {
          return handler._key ? handler._key !== key : key || handler._namespace !== namespace;
        });
      });
    }
    function offBy(key) {
      forOwn$1(handlers, (eventHandlers, event) => {
        off(event, key);
      });
    }
    function emit(event) {
      (handlers[event] || []).forEach((handler) => {
        handler._callback.apply(handler, slice(arguments, 1));
      });
    }
    function destroy() {
      handlers = {};
    }
    function forEachEvent(events, iteratee) {
      toArray(events).join(" ").split(" ").forEach((eventNS) => {
        const fragments = eventNS.split(".");
        iteratee(fragments[0], fragments[1]);
      });
    }
    return {
      on,
      off,
      offBy,
      emit,
      destroy
    };
  }
  const EVENT_MOUNTED = "mounted";
  const EVENT_READY = "ready";
  const EVENT_MOVE = "move";
  const EVENT_MOVED = "moved";
  const EVENT_CLICK = "click";
  const EVENT_ACTIVE = "active";
  const EVENT_INACTIVE = "inactive";
  const EVENT_VISIBLE = "visible";
  const EVENT_HIDDEN = "hidden";
  const EVENT_SLIDE_KEYDOWN = "slide:keydown";
  const EVENT_REFRESH = "refresh";
  const EVENT_UPDATED = "updated";
  const EVENT_RESIZE = "resize";
  const EVENT_RESIZED = "resized";
  const EVENT_REPOSITIONED = "repositioned";
  const EVENT_DRAG = "drag";
  const EVENT_DRAGGING = "dragging";
  const EVENT_DRAGGED = "dragged";
  const EVENT_SCROLL = "scroll";
  const EVENT_SCROLLED = "scrolled";
  const EVENT_DESTROY = "destroy";
  const EVENT_ARROWS_MOUNTED = "arrows:mounted";
  const EVENT_ARROWS_UPDATED = "arrows:updated";
  const EVENT_PAGINATION_MOUNTED = "pagination:mounted";
  const EVENT_PAGINATION_UPDATED = "pagination:updated";
  const EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
  const EVENT_AUTOPLAY_PLAY = "autoplay:play";
  const EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
  const EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
  const EVENT_LAZYLOAD_LOADED = "lazyload:loaded";
  function EventInterface(Splide2) {
    const { event } = Splide2;
    const key = {};
    let listeners = [];
    function on(events, callback, priority) {
      event.on(events, callback, key, priority);
    }
    function off(events) {
      event.off(events, key);
    }
    function bind(targets, events, callback, options) {
      forEachEvent(targets, events, (target, event2) => {
        listeners.push([target, event2, callback, options]);
        target.addEventListener(event2, callback, options);
      });
    }
    function unbind(targets, events, callback) {
      forEachEvent(targets, events, (target, event2) => {
        listeners = listeners.filter((listener) => {
          if (listener[0] === target && listener[1] === event2 && (!callback || listener[2] === callback)) {
            target.removeEventListener(event2, listener[2], listener[3]);
            return false;
          }
          return true;
        });
      });
    }
    function forEachEvent(targets, events, iteratee) {
      forEach(targets, (target) => {
        if (target) {
          events.split(" ").forEach(iteratee.bind(null, target));
        }
      });
    }
    function destroy() {
      listeners = listeners.filter((data) => unbind(data[0], data[1]));
      event.offBy(key);
    }
    event.on(EVENT_DESTROY, destroy, key);
    return {
      on,
      off,
      emit: event.emit,
      bind,
      unbind,
      destroy
    };
  }
  function RequestInterval(interval, onInterval, onUpdate, limit) {
    const { now } = Date;
    let startTime;
    let rate = 0;
    let id;
    let paused = true;
    let count = 0;
    function update() {
      if (!paused) {
        const elapsed = now() - startTime;
        if (elapsed >= interval) {
          rate = 1;
          startTime = now();
        } else {
          rate = elapsed / interval;
        }
        if (onUpdate) {
          onUpdate(rate);
        }
        if (rate === 1) {
          onInterval();
          if (limit && ++count >= limit) {
            return pause();
          }
        }
        raf(update);
      }
    }
    function start(resume) {
      !resume && cancel();
      startTime = now() - (resume ? rate * interval : 0);
      paused = false;
      raf(update);
    }
    function pause() {
      paused = true;
    }
    function rewind() {
      startTime = now();
      rate = 0;
      if (onUpdate) {
        onUpdate(rate);
      }
    }
    function cancel() {
      cancelAnimationFrame(id);
      rate = 0;
      id = 0;
      paused = true;
    }
    function isPaused() {
      return paused;
    }
    return {
      start,
      rewind,
      pause,
      cancel,
      isPaused
    };
  }
  function State(initialState) {
    let state = initialState;
    function set(value) {
      state = value;
    }
    function is(states) {
      return includes(toArray(states), state);
    }
    return { set, is };
  }
  function Throttle(func, duration) {
    let interval;
    function throttled() {
      if (!interval) {
        interval = RequestInterval(duration || 0, () => {
          func.apply(this, arguments);
          interval = null;
        }, null, 1);
        interval.start();
      }
    }
    return throttled;
  }
  function Options(Splide2, Components2, options) {
    const throttledObserve = Throttle(observe);
    let initialOptions;
    let points;
    let currPoint;
    function setup() {
      try {
        merge$1(options, JSON.parse(getAttribute(Splide2.root, DATA_ATTRIBUTE)));
      } catch (e) {
        assert(false, e.message);
      }
      initialOptions = merge$1({}, options);
      const { breakpoints } = options;
      if (breakpoints) {
        const isMin = options.mediaQuery === "min";
        points = Object.keys(breakpoints).sort((n, m) => isMin ? +m - +n : +n - +m).map((point) => [
          point,
          matchMedia(`(${isMin ? "min" : "max"}-width:${point}px)`)
        ]);
        observe();
      }
    }
    function mount() {
      if (points) {
        addEventListener("resize", throttledObserve);
      }
    }
    function destroy(completely) {
      if (completely) {
        removeEventListener("resize", throttledObserve);
      }
    }
    function observe() {
      const item = find(points, (item2) => item2[1].matches) || [];
      if (item[0] !== currPoint) {
        onMatch(currPoint = item[0]);
      }
    }
    function onMatch(point) {
      const newOptions = options.breakpoints[point] || initialOptions;
      if (newOptions.destroy) {
        Splide2.options = initialOptions;
        Splide2.destroy(newOptions.destroy === "completely");
      } else {
        if (Splide2.state.is(DESTROYED)) {
          destroy(true);
          Splide2.mount();
        }
        Splide2.options = newOptions;
      }
    }
    return {
      setup,
      mount,
      destroy
    };
  }
  const RTL = "rtl";
  const TTB = "ttb";
  const ORIENTATION_MAP = {
    marginRight: ["marginBottom", "marginLeft"],
    autoWidth: ["autoHeight"],
    fixedWidth: ["fixedHeight"],
    paddingLeft: ["paddingTop", "paddingRight"],
    paddingRight: ["paddingBottom", "paddingLeft"],
    width: ["height"],
    left: ["top", "right"],
    right: ["bottom", "left"],
    x: ["y"],
    X: ["Y"],
    Y: ["X"],
    ArrowLeft: ["ArrowUp", "ArrowRight"],
    ArrowRight: ["ArrowDown", "ArrowLeft"]
  };
  function Direction(Splide2, Components2, options) {
    function resolve(prop, axisOnly) {
      const { direction } = options;
      const index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
      return ORIENTATION_MAP[prop][index] || prop;
    }
    function orient(value) {
      return value * (options.direction === RTL ? 1 : -1);
    }
    return {
      resolve,
      orient
    };
  }
  const CLASS_ROOT = PROJECT_CODE;
  const CLASS_SLIDER = `${PROJECT_CODE}__slider`;
  const CLASS_TRACK = `${PROJECT_CODE}__track`;
  const CLASS_LIST = `${PROJECT_CODE}__list`;
  const CLASS_SLIDE = `${PROJECT_CODE}__slide`;
  const CLASS_CLONE = `${CLASS_SLIDE}--clone`;
  const CLASS_CONTAINER = `${CLASS_SLIDE}__container`;
  const CLASS_ARROWS = `${PROJECT_CODE}__arrows`;
  const CLASS_ARROW = `${PROJECT_CODE}__arrow`;
  const CLASS_ARROW_PREV = `${CLASS_ARROW}--prev`;
  const CLASS_ARROW_NEXT = `${CLASS_ARROW}--next`;
  const CLASS_PAGINATION = `${PROJECT_CODE}__pagination`;
  const CLASS_PAGINATION_PAGE = `${CLASS_PAGINATION}__page`;
  const CLASS_PROGRESS = `${PROJECT_CODE}__progress`;
  const CLASS_PROGRESS_BAR = `${CLASS_PROGRESS}__bar`;
  const CLASS_AUTOPLAY = `${PROJECT_CODE}__autoplay`;
  const CLASS_PLAY = `${PROJECT_CODE}__play`;
  const CLASS_PAUSE = `${PROJECT_CODE}__pause`;
  const CLASS_SPINNER = `${PROJECT_CODE}__spinner`;
  const CLASS_INITIALIZED = "is-initialized";
  const CLASS_ACTIVE = "is-active";
  const CLASS_PREV = "is-prev";
  const CLASS_NEXT = "is-next";
  const CLASS_VISIBLE = "is-visible";
  const CLASS_LOADING = "is-loading";
  const STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING];
  const CLASSES = {
    slide: CLASS_SLIDE,
    clone: CLASS_CLONE,
    arrows: CLASS_ARROWS,
    arrow: CLASS_ARROW,
    prev: CLASS_ARROW_PREV,
    next: CLASS_ARROW_NEXT,
    pagination: CLASS_PAGINATION,
    page: CLASS_PAGINATION_PAGE,
    spinner: CLASS_SPINNER
  };
  function Elements(Splide2, Components2, options) {
    const { on } = EventInterface(Splide2);
    const { root } = Splide2;
    const elements = {};
    const slides = [];
    let classes;
    let slider;
    let track;
    let list;
    function setup() {
      collect();
      identify();
      addClass(root, classes = getClasses());
    }
    function mount() {
      on(EVENT_REFRESH, refresh, DEFAULT_EVENT_PRIORITY - 2);
      on(EVENT_UPDATED, update);
    }
    function destroy() {
      [root, track, list].forEach((elm) => {
        removeAttribute(elm, "style");
      });
      empty(slides);
      removeClass(root, classes);
    }
    function refresh() {
      destroy();
      setup();
    }
    function update() {
      removeClass(root, classes);
      addClass(root, classes = getClasses());
    }
    function collect() {
      slider = child(root, `.${CLASS_SLIDER}`);
      track = query(root, `.${CLASS_TRACK}`);
      list = child(track, `.${CLASS_LIST}`);
      assert(track && list, "A track/list element is missing.");
      push(slides, children(list, `.${CLASS_SLIDE}:not(.${CLASS_CLONE})`));
      const autoplay = find2(`.${CLASS_AUTOPLAY}`);
      const arrows = find2(`.${CLASS_ARROWS}`);
      assign(elements, {
        root,
        slider,
        track,
        list,
        slides,
        arrows,
        autoplay,
        prev: query(arrows, `.${CLASS_ARROW_PREV}`),
        next: query(arrows, `.${CLASS_ARROW_NEXT}`),
        bar: query(find2(`.${CLASS_PROGRESS}`), `.${CLASS_PROGRESS_BAR}`),
        play: query(autoplay, `.${CLASS_PLAY}`),
        pause: query(autoplay, `.${CLASS_PAUSE}`)
      });
    }
    function identify() {
      const id = root.id || uniqueId(PROJECT_CODE);
      root.id = id;
      track.id = track.id || `${id}-track`;
      list.id = list.id || `${id}-list`;
    }
    function find2(selector) {
      return child(root, selector) || child(slider, selector);
    }
    function getClasses() {
      return [
        `${CLASS_ROOT}--${options.type}`,
        `${CLASS_ROOT}--${options.direction}`,
        options.drag && `${CLASS_ROOT}--draggable`,
        options.isNavigation && `${CLASS_ROOT}--nav`,
        CLASS_ACTIVE
      ];
    }
    return assign(elements, {
      setup,
      mount,
      destroy
    });
  }
  const ROLE = "role";
  const ARIA_CONTROLS = "aria-controls";
  const ARIA_CURRENT = "aria-current";
  const ARIA_LABEL = "aria-label";
  const ARIA_HIDDEN = "aria-hidden";
  const TAB_INDEX = "tabindex";
  const DISABLED = "disabled";
  const ARIA_ORIENTATION = "aria-orientation";
  const ALL_ATTRIBUTES = [
    ROLE,
    ARIA_CONTROLS,
    ARIA_CURRENT,
    ARIA_LABEL,
    ARIA_HIDDEN,
    ARIA_ORIENTATION,
    TAB_INDEX,
    DISABLED
  ];
  const SLIDE = "slide";
  const LOOP = "loop";
  const FADE = "fade";
  function Slide$1(Splide2, index, slideIndex, slide) {
    const { on, emit, bind, destroy: destroyEvents } = EventInterface(Splide2);
    const { Components, root, options } = Splide2;
    const { isNavigation, updateOnMove } = options;
    const { resolve } = Components.Direction;
    const styles = getAttribute(slide, "style");
    const isClone = slideIndex > -1;
    const container = child(slide, `.${CLASS_CONTAINER}`);
    const focusableNodes = options.focusableNodes && queryAll(slide, options.focusableNodes);
    let destroyed;
    function mount() {
      init();
      bind(slide, "click keydown", (e) => {
        emit(e.type === "click" ? EVENT_CLICK : EVENT_SLIDE_KEYDOWN, this, e);
      });
      on([EVENT_REFRESH, EVENT_REPOSITIONED, EVENT_MOVED, EVENT_SCROLLED], update.bind(this));
      if (updateOnMove) {
        on(EVENT_MOVE, onMove.bind(this));
      }
    }
    function init() {
      if (!isClone) {
        slide.id = `${root.id}-slide${pad(index + 1)}`;
      }
      if (isNavigation) {
        const idx = isClone ? slideIndex : index;
        const label = format(options.i18n.slideX, idx + 1);
        const controls = Splide2.splides.map((splide) => splide.root.id).join(" ");
        setAttribute(slide, ARIA_LABEL, label);
        setAttribute(slide, ARIA_CONTROLS, controls);
        setAttribute(slide, ROLE, "menuitem");
      }
    }
    function destroy() {
      destroyed = true;
      destroyEvents();
      removeClass(slide, STATUS_CLASSES);
      removeAttribute(slide, ALL_ATTRIBUTES);
      setAttribute(slide, "style", styles);
    }
    function onMove(next, prev, dest) {
      if (!destroyed) {
        update.call(this);
        if (dest === index) {
          updateActivity.call(this, true);
        }
      }
    }
    function update() {
      if (!destroyed) {
        const { index: currIndex } = Splide2;
        updateActivity.call(this, isActive());
        updateVisibility.call(this, isVisible());
        toggleClass(slide, CLASS_PREV, index === currIndex - 1);
        toggleClass(slide, CLASS_NEXT, index === currIndex + 1);
      }
    }
    function updateActivity(active) {
      if (active !== hasClass(slide, CLASS_ACTIVE)) {
        toggleClass(slide, CLASS_ACTIVE, active);
        if (isNavigation) {
          setAttribute(slide, ARIA_CURRENT, active || null);
        }
        emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, this);
      }
    }
    function updateVisibility(visible) {
      const ariaHidden = !visible && !isActive();
      setAttribute(slide, ARIA_HIDDEN, ariaHidden || null);
      setAttribute(slide, TAB_INDEX, !ariaHidden && options.slideFocus ? 0 : null);
      if (focusableNodes) {
        focusableNodes.forEach((node) => {
          setAttribute(node, TAB_INDEX, ariaHidden ? -1 : null);
        });
      }
      if (visible !== hasClass(slide, CLASS_VISIBLE)) {
        toggleClass(slide, CLASS_VISIBLE, visible);
        emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, this);
      }
    }
    function style$1(prop, value, useContainer) {
      style(useContainer && container || slide, prop, value);
    }
    function isActive() {
      return Splide2.index === index;
    }
    function isVisible() {
      if (Splide2.is(FADE)) {
        return isActive();
      }
      const trackRect = rect(Components.Elements.track);
      const slideRect = rect(slide);
      const left = resolve("left");
      const right = resolve("right");
      return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
    }
    function isWithin(from, distance) {
      let diff = abs(from - index);
      if (!Splide2.is(SLIDE) && !isClone) {
        diff = min(diff, Splide2.length - diff);
      }
      return diff <= distance;
    }
    return {
      index,
      slideIndex,
      slide,
      container,
      isClone,
      mount,
      destroy,
      style: style$1,
      isWithin
    };
  }
  function Slides(Splide2, Components2, options) {
    const { on, emit, bind } = EventInterface(Splide2);
    const { slides, list } = Components2.Elements;
    const Slides2 = [];
    function mount() {
      init();
      on(EVENT_REFRESH, refresh);
      on([EVENT_MOUNTED, EVENT_REFRESH], () => {
        Slides2.sort((Slide1, Slide2) => Slide1.index - Slide2.index);
      });
    }
    function init() {
      slides.forEach((slide, index) => {
        register(slide, index, -1);
      });
    }
    function destroy() {
      forEach$1((Slide2) => {
        Slide2.destroy();
      });
      empty(Slides2);
    }
    function refresh() {
      destroy();
      init();
    }
    function register(slide, index, slideIndex) {
      const object = Slide$1(Splide2, index, slideIndex, slide);
      object.mount();
      Slides2.push(object);
    }
    function get(excludeClones) {
      return excludeClones ? filter((Slide2) => !Slide2.isClone) : Slides2;
    }
    function getIn(page) {
      const { Controller: Controller2 } = Components2;
      const index = Controller2.toIndex(page);
      const max2 = Controller2.hasFocus() ? 1 : options.perPage;
      return filter((Slide2) => between(Slide2.index, index, index + max2 - 1));
    }
    function getAt(index) {
      return filter(index)[0];
    }
    function add(items, index) {
      forEach(items, (slide) => {
        if (isString(slide)) {
          slide = parseHtml(slide);
        }
        if (isHTMLElement(slide)) {
          const ref = slides[index];
          ref ? before(slide, ref) : append(list, slide);
          addClass(slide, options.classes.slide);
          observeImages(slide, emit.bind(null, EVENT_RESIZE));
        }
      });
      emit(EVENT_REFRESH);
    }
    function remove$1(matcher) {
      remove(filter(matcher).map((Slide2) => Slide2.slide));
      emit(EVENT_REFRESH);
    }
    function forEach$1(iteratee, excludeClones) {
      get(excludeClones).forEach(iteratee);
    }
    function filter(matcher) {
      return Slides2.filter(isFunction(matcher) ? matcher : (Slide2) => isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index));
    }
    function style2(prop, value, useContainer) {
      forEach$1((Slide2) => {
        Slide2.style(prop, value, useContainer);
      });
    }
    function observeImages(elm, callback) {
      const images = queryAll(elm, "img");
      let { length } = images;
      if (length) {
        images.forEach((img) => {
          bind(img, "load error", () => {
            if (!--length) {
              callback();
            }
          });
        });
      } else {
        callback();
      }
    }
    function getLength(excludeClones) {
      return excludeClones ? slides.length : Slides2.length;
    }
    function isEnough() {
      return Slides2.length > options.perPage;
    }
    return {
      mount,
      destroy,
      register,
      get,
      getIn,
      getAt,
      add,
      remove: remove$1,
      forEach: forEach$1,
      filter,
      style: style2,
      getLength,
      isEnough
    };
  }
  function Layout(Splide2, Components2, options) {
    const { on, bind, emit } = EventInterface(Splide2);
    const { Slides: Slides2 } = Components2;
    const { resolve } = Components2.Direction;
    const { track, list } = Components2.Elements;
    const { getAt } = Slides2;
    let vertical;
    function mount() {
      init();
      bind(window, "resize load", Throttle(emit.bind(this, EVENT_RESIZE)));
      on([EVENT_UPDATED, EVENT_REFRESH], init);
      on(EVENT_RESIZE, resize);
    }
    function init() {
      vertical = options.direction === TTB;
      style(Splide2.root, "maxWidth", unit(options.width));
      style(track, resolve("paddingLeft"), cssPadding(false));
      style(track, resolve("paddingRight"), cssPadding(true));
      resize();
    }
    function resize() {
      style(track, "height", cssTrackHeight());
      Slides2.style(resolve("marginRight"), unit(options.gap));
      Slides2.style("width", cssSlideWidth() || null);
      setSlidesHeight();
      emit(EVENT_RESIZED);
    }
    function setSlidesHeight() {
      Slides2.style("height", cssSlideHeight() || null, true);
    }
    function cssPadding(right) {
      const { padding } = options;
      const prop = resolve(right ? "right" : "left", true);
      return padding && unit(padding[prop] || (isObject$1(padding) ? 0 : padding)) || "0px";
    }
    function cssTrackHeight() {
      let height = "";
      if (vertical) {
        height = cssHeight();
        assert(height, "height or heightRatio is missing.");
        height = `calc(${height} - ${cssPadding(false)} - ${cssPadding(true)})`;
      }
      return height;
    }
    function cssHeight() {
      return unit(options.height || rect(list).width * options.heightRatio);
    }
    function cssSlideWidth() {
      return options.autoWidth ? "" : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
    }
    function cssSlideHeight() {
      return unit(options.fixedHeight) || (vertical ? options.autoHeight ? "" : cssSlideSize() : cssHeight());
    }
    function cssSlideSize() {
      const gap = unit(options.gap);
      return `calc((100%${gap && ` + ${gap}`})/${options.perPage || 1}${gap && ` - ${gap}`})`;
    }
    function listSize() {
      return rect(list)[resolve("width")];
    }
    function slideSize(index, withoutGap) {
      const Slide2 = getAt(index || 0);
      return Slide2 ? rect(Slide2.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
    }
    function totalSize(index, withoutGap) {
      const Slide2 = getAt(index);
      if (Slide2) {
        const right = rect(Slide2.slide)[resolve("right")];
        const left = rect(list)[resolve("left")];
        return abs(right - left) + (withoutGap ? 0 : getGap());
      }
      return 0;
    }
    function sliderSize() {
      return totalSize(Splide2.length - 1, true) - totalSize(-1, true);
    }
    function getGap() {
      const Slide2 = getAt(0);
      return Slide2 && parseFloat(style(Slide2.slide, resolve("marginRight"))) || 0;
    }
    function getPadding(right) {
      return parseFloat(style(track, resolve(`padding${right ? "Right" : "Left"}`, true))) || 0;
    }
    return {
      mount,
      listSize,
      slideSize,
      sliderSize,
      totalSize,
      getPadding
    };
  }
  function Clones(Splide2, Components2, options) {
    const { on, emit } = EventInterface(Splide2);
    const { Elements: Elements2, Slides: Slides2 } = Components2;
    const { resolve } = Components2.Direction;
    const clones = [];
    let cloneCount;
    function mount() {
      init();
      on(EVENT_REFRESH, refresh);
      on([EVENT_UPDATED, EVENT_RESIZE], observe);
    }
    function init() {
      if (cloneCount = computeCloneCount()) {
        generate(cloneCount);
        emit(EVENT_RESIZE);
      }
    }
    function destroy() {
      remove(clones);
      empty(clones);
    }
    function refresh() {
      destroy();
      init();
    }
    function observe() {
      if (cloneCount < computeCloneCount()) {
        emit(EVENT_REFRESH);
      }
    }
    function generate(count) {
      const slides = Slides2.get().slice();
      const { length } = slides;
      if (length) {
        while (slides.length < count) {
          push(slides, slides);
        }
        push(slides.slice(-count), slides.slice(0, count)).forEach((Slide2, index) => {
          const isHead = index < count;
          const clone = cloneDeep(Slide2.slide, index);
          isHead ? before(clone, slides[0].slide) : append(Elements2.list, clone);
          push(clones, clone);
          Slides2.register(clone, index - count + (isHead ? 0 : length), Slide2.index);
        });
      }
    }
    function cloneDeep(elm, index) {
      const clone = elm.cloneNode(true);
      addClass(clone, options.classes.clone);
      clone.id = `${Splide2.root.id}-clone${pad(index + 1)}`;
      return clone;
    }
    function computeCloneCount() {
      let { clones: clones2 } = options;
      if (!Splide2.is(LOOP)) {
        clones2 = 0;
      } else if (!clones2) {
        const fixedSize = measure(Elements2.list, options[resolve("fixedWidth")]);
        const fixedCount = fixedSize && ceil(rect(Elements2.track)[resolve("width")] / fixedSize);
        const baseCount = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage;
        clones2 = baseCount * (options.drag ? (options.flickMaxPages || 1) + 1 : 2);
      }
      return clones2;
    }
    return {
      mount,
      destroy
    };
  }
  function Move(Splide2, Components2, options) {
    const { on, emit } = EventInterface(Splide2);
    const { slideSize, getPadding, totalSize, listSize, sliderSize } = Components2.Layout;
    const { resolve, orient } = Components2.Direction;
    const { list, track } = Components2.Elements;
    let waiting;
    function mount() {
      on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
    }
    function destroy() {
      removeAttribute(list, "style");
    }
    function reposition() {
      Components2.Scroll.cancel();
      jump(Splide2.index);
      emit(EVENT_REPOSITIONED);
    }
    function move(dest, index, prev, callback) {
      if (!isBusy()) {
        const { set } = Splide2.state;
        const position = getPosition();
        const looping = dest !== index;
        waiting = looping || options.waitForTransition;
        set(MOVING);
        emit(EVENT_MOVE, index, prev, dest);
        Components2.Transition.start(dest, () => {
          looping && jump(index);
          waiting = false;
          set(IDLE);
          emit(EVENT_MOVED, index, prev, dest);
          if (options.trimSpace === "move" && dest !== prev && position === getPosition()) {
            Components2.Controller.go(dest > prev ? ">" : "<", false, callback);
          } else {
            callback && callback();
          }
        });
      }
    }
    function jump(index) {
      translate(toPosition(index, true));
    }
    function translate(position, preventLoop) {
      if (!Splide2.is(FADE)) {
        list.style.transform = `translate${resolve("X")}(${preventLoop ? position : loop(position)}px)`;
      }
    }
    function loop(position) {
      if (!waiting && Splide2.is(LOOP)) {
        const diff = orient(position - getPosition());
        const exceededMin = exceededLimit(false, position) && diff < 0;
        const exceededMax = exceededLimit(true, position) && diff > 0;
        if (exceededMin || exceededMax) {
          position = shift(position, exceededMax);
        }
      }
      return position;
    }
    function shift(position, backwards) {
      const excess = position - getLimit(backwards);
      const size = sliderSize();
      position -= sign(excess) * size * ceil(abs(excess) / size);
      return position;
    }
    function cancel() {
      waiting = false;
      translate(getPosition());
      Components2.Transition.cancel();
    }
    function toIndex(position) {
      const Slides2 = Components2.Slides.get();
      let index = 0;
      let minDistance = Infinity;
      for (let i = 0; i < Slides2.length; i++) {
        const slideIndex = Slides2[i].index;
        const distance = abs(toPosition(slideIndex, true) - position);
        if (distance <= minDistance) {
          minDistance = distance;
          index = slideIndex;
        } else {
          break;
        }
      }
      return index;
    }
    function toPosition(index, trimming) {
      const position = orient(totalSize(index - 1) - offset(index));
      return trimming ? trim(position) : position;
    }
    function getPosition() {
      const left = resolve("left");
      return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
    }
    function trim(position) {
      if (options.trimSpace && Splide2.is(SLIDE)) {
        position = clamp(position, 0, orient(sliderSize() - listSize()));
      }
      return position;
    }
    function offset(index) {
      const { focus: focus2 } = options;
      return focus2 === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus2 * slideSize(index) || 0;
    }
    function getLimit(max2) {
      return toPosition(max2 ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
    }
    function isBusy() {
      return !!waiting;
    }
    function exceededLimit(max2, position) {
      position = isUndefined(position) ? getPosition() : position;
      const exceededMin = max2 !== true && orient(position) < orient(getLimit(false));
      const exceededMax = max2 !== false && orient(position) > orient(getLimit(true));
      return exceededMin || exceededMax;
    }
    return {
      mount,
      destroy,
      move,
      jump,
      translate,
      shift,
      cancel,
      toIndex,
      toPosition,
      getPosition,
      getLimit,
      isBusy,
      exceededLimit
    };
  }
  function Controller(Splide2, Components2, options) {
    const { on } = EventInterface(Splide2);
    const { Move: Move2 } = Components2;
    const { getPosition, getLimit } = Move2;
    const { isEnough, getLength } = Components2.Slides;
    const isLoop = Splide2.is(LOOP);
    const isSlide = Splide2.is(SLIDE);
    let currIndex = options.start || 0;
    let prevIndex = currIndex;
    let slideCount;
    let perMove;
    let perPage;
    function mount() {
      init();
      on([EVENT_UPDATED, EVENT_REFRESH], init, DEFAULT_EVENT_PRIORITY - 1);
    }
    function init() {
      slideCount = getLength(true);
      perMove = options.perMove;
      perPage = options.perPage;
      currIndex = clamp(currIndex, 0, slideCount - 1);
    }
    function go(control, allowSameIndex, callback) {
      const dest = parse(control);
      if (options.useScroll) {
        scroll(dest, true, true, options.speed, callback);
      } else {
        const index = loop(dest);
        if (index > -1 && !Move2.isBusy() && (allowSameIndex || index !== currIndex)) {
          setIndex(index);
          Move2.move(dest, index, prevIndex, callback);
        }
      }
    }
    function scroll(destination, useIndex, snap, duration, callback) {
      const dest = useIndex ? destination : toDest(destination);
      Components2.Scroll.scroll(useIndex || snap ? Move2.toPosition(dest, true) : destination, duration, () => {
        setIndex(Move2.toIndex(Move2.getPosition()));
        callback && callback();
      });
    }
    function parse(control) {
      let index = currIndex;
      if (isString(control)) {
        const [, indicator, number] = control.match(/([+\-<>])(\d+)?/) || [];
        if (indicator === "+" || indicator === "-") {
          index = computeDestIndex(currIndex + +`${indicator}${+number || 1}`, currIndex, true);
        } else if (indicator === ">") {
          index = number ? toIndex(+number) : getNext(true);
        } else if (indicator === "<") {
          index = getPrev(true);
        }
      } else {
        if (isLoop) {
          index = clamp(control, -perPage, slideCount + perPage - 1);
        } else {
          index = clamp(control, 0, getEnd());
        }
      }
      return index;
    }
    function getNext(destination) {
      return getAdjacent(false, destination);
    }
    function getPrev(destination) {
      return getAdjacent(true, destination);
    }
    function getAdjacent(prev, destination) {
      const number = perMove || (hasFocus() ? 1 : perPage);
      const dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex);
      if (dest === -1 && isSlide) {
        if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
          return prev ? 0 : getEnd();
        }
      }
      return destination ? dest : loop(dest);
    }
    function computeDestIndex(dest, from, incremental) {
      if (isEnough()) {
        const end = getEnd();
        if (dest < 0 || dest > end) {
          if (between(0, dest, from, true) || between(end, from, dest, true)) {
            dest = toIndex(toPage(dest));
          } else {
            if (isLoop) {
              dest = perMove ? dest : dest < 0 ? -(slideCount % perPage || perPage) : slideCount;
            } else if (options.rewind) {
              dest = dest < 0 ? end : 0;
            } else {
              dest = -1;
            }
          }
        } else {
          if (!isLoop && !incremental && dest !== from) {
            dest = perMove ? dest : toIndex(toPage(from) + (dest < from ? -1 : 1));
          }
        }
      } else {
        dest = -1;
      }
      return dest;
    }
    function getEnd() {
      let end = slideCount - perPage;
      if (hasFocus() || isLoop && perMove) {
        end = slideCount - 1;
      }
      return max(end, 0);
    }
    function loop(index) {
      if (isLoop) {
        return isEnough() ? index % slideCount + (index < 0 ? slideCount : 0) : -1;
      }
      return index;
    }
    function toIndex(page) {
      return clamp(hasFocus() ? page : perPage * page, 0, getEnd());
    }
    function toPage(index) {
      if (!hasFocus()) {
        index = between(index, slideCount - perPage, slideCount - 1) ? slideCount - 1 : index;
        index = floor(index / perPage);
      }
      return index;
    }
    function toDest(destination) {
      const closest = Move2.toIndex(destination);
      return isSlide ? clamp(closest, 0, getEnd()) : closest;
    }
    function setIndex(index) {
      if (index !== currIndex) {
        prevIndex = currIndex;
        currIndex = index;
      }
    }
    function getIndex(prev) {
      return prev ? prevIndex : currIndex;
    }
    function hasFocus() {
      return !isUndefined(options.focus) || options.isNavigation;
    }
    return {
      mount,
      go,
      scroll,
      getNext,
      getPrev,
      getEnd,
      setIndex,
      getIndex,
      toIndex,
      toPage,
      toDest,
      hasFocus
    };
  }
  const XML_NAME_SPACE = "http://www.w3.org/2000/svg";
  const PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
  const SIZE = 40;
  function Arrows(Splide2, Components2, options) {
    const { on, bind, emit } = EventInterface(Splide2);
    const { classes, i18n } = options;
    const { Elements: Elements2, Controller: Controller2 } = Components2;
    let wrapper = Elements2.arrows;
    let prev = Elements2.prev;
    let next = Elements2.next;
    let created;
    const arrows = {};
    function mount() {
      init();
      on(EVENT_UPDATED, init);
    }
    function init() {
      if (options.arrows) {
        if (!prev || !next) {
          createArrows();
        }
      }
      if (prev && next) {
        if (!arrows.prev) {
          const { id } = Elements2.track;
          setAttribute(prev, ARIA_CONTROLS, id);
          setAttribute(next, ARIA_CONTROLS, id);
          arrows.prev = prev;
          arrows.next = next;
          listen();
          emit(EVENT_ARROWS_MOUNTED, prev, next);
        } else {
          display(wrapper, options.arrows === false ? "none" : "");
        }
      }
    }
    function destroy() {
      if (created) {
        remove(wrapper);
      } else {
        removeAttribute(prev, ALL_ATTRIBUTES);
        removeAttribute(next, ALL_ATTRIBUTES);
      }
    }
    function listen() {
      const { go } = Controller2;
      on([EVENT_MOUNTED, EVENT_MOVED, EVENT_UPDATED, EVENT_REFRESH, EVENT_SCROLLED], update);
      bind(next, "click", () => {
        go(">", true);
      });
      bind(prev, "click", () => {
        go("<", true);
      });
    }
    function createArrows() {
      wrapper = create("div", classes.arrows);
      prev = createArrow(true);
      next = createArrow(false);
      created = true;
      append(wrapper, [prev, next]);
      before(wrapper, child(options.arrows === "slider" && Elements2.slider || Splide2.root));
    }
    function createArrow(prev2) {
      const arrow = `<button class="${classes.arrow} ${prev2 ? classes.prev : classes.next}" type="button"><svg xmlns="${XML_NAME_SPACE}" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"><path d="${options.arrowPath || PATH}" />`;
      return parseHtml(arrow);
    }
    function update() {
      const index = Splide2.index;
      const prevIndex = Controller2.getPrev();
      const nextIndex = Controller2.getNext();
      const prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
      const nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
      prev.disabled = prevIndex < 0;
      next.disabled = nextIndex < 0;
      setAttribute(prev, ARIA_LABEL, prevLabel);
      setAttribute(next, ARIA_LABEL, nextLabel);
      emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
    }
    return {
      arrows,
      mount,
      destroy
    };
  }
  function Autoplay(Splide2, Components2, options) {
    const { on, bind, emit } = EventInterface(Splide2);
    const { Elements: Elements2 } = Components2;
    const interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), update);
    const { isPaused } = interval;
    let hovered;
    let focused;
    let paused;
    function mount() {
      const { autoplay } = options;
      if (autoplay) {
        initButton(true);
        initButton(false);
        listen();
        if (autoplay !== "pause") {
          play();
        }
      }
    }
    function initButton(forPause) {
      const prop = forPause ? "pause" : "play";
      const button = Elements2[prop];
      if (button) {
        setAttribute(button, ARIA_CONTROLS, Elements2.track.id);
        setAttribute(button, ARIA_LABEL, options.i18n[prop]);
        bind(button, "click", forPause ? pause : play);
      }
    }
    function listen() {
      const { root } = Elements2;
      if (options.pauseOnHover) {
        bind(root, "mouseenter mouseleave", (e) => {
          hovered = e.type === "mouseenter";
          autoToggle();
        });
      }
      if (options.pauseOnFocus) {
        bind(root, "focusin focusout", (e) => {
          focused = e.type === "focusin";
          autoToggle();
        });
      }
      on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
    }
    function play() {
      if (isPaused() && Components2.Slides.isEnough()) {
        interval.start(!options.resetProgress);
        focused = hovered = paused = false;
        emit(EVENT_AUTOPLAY_PLAY);
      }
    }
    function pause(manual = true) {
      if (!isPaused()) {
        interval.pause();
        emit(EVENT_AUTOPLAY_PAUSE);
      }
      paused = manual;
    }
    function autoToggle() {
      if (!paused) {
        if (!hovered && !focused) {
          play();
        } else {
          pause(false);
        }
      }
    }
    function update(rate) {
      const { bar } = Elements2;
      if (bar) {
        style(bar, "width", `${rate * 100}%`);
      }
      emit(EVENT_AUTOPLAY_PLAYING, rate);
    }
    return {
      mount,
      destroy: interval.cancel,
      play,
      pause,
      isPaused
    };
  }
  function Cover(Splide2, Components2, options) {
    const { on } = EventInterface(Splide2);
    function mount() {
      if (options.cover) {
        on(EVENT_LAZYLOAD_LOADED, (img, Slide2) => {
          toggle(true, img, Slide2);
        });
        on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply.bind(null, true));
      }
    }
    function destroy() {
      apply(false);
    }
    function apply(cover) {
      Components2.Slides.forEach((Slide2) => {
        const img = child(Slide2.container || Slide2.slide, "img");
        if (img && img.src) {
          toggle(cover, img, Slide2);
        }
      });
    }
    function toggle(cover, img, Slide2) {
      Slide2.style("background", cover ? `center/cover no-repeat url("${img.src}")` : "", true);
      display(img, cover ? "none" : "");
    }
    return {
      mount,
      destroy
    };
  }
  const BOUNCE_DIFF_THRESHOLD = 10;
  const BOUNCE_DURATION = 600;
  const FRICTION_FACTOR = 0.6;
  const BASE_VELOCITY = 1.5;
  const MIN_DURATION = 800;
  function Scroll(Splide2, Components2, options) {
    const { on, emit } = EventInterface(Splide2);
    const { Move: Move2 } = Components2;
    const { getPosition, getLimit, exceededLimit } = Move2;
    let interval;
    let scrollCallback;
    function mount() {
      on(EVENT_MOVE, clear);
      on([EVENT_UPDATED, EVENT_REFRESH], cancel);
    }
    function scroll(destination, duration, callback, suppressConstraint) {
      const start = getPosition();
      let friction = 1;
      duration = duration || computeDuration(abs(destination - start));
      scrollCallback = callback;
      clear();
      interval = RequestInterval(duration, onScrolled, (rate) => {
        const position = getPosition();
        const target = start + (destination - start) * easing(rate);
        const diff = (target - getPosition()) * friction;
        Move2.translate(position + diff);
        if (Splide2.is(SLIDE) && !suppressConstraint && exceededLimit()) {
          friction *= FRICTION_FACTOR;
          if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
            bounce(exceededLimit(false));
          }
        }
      }, 1);
      emit(EVENT_SCROLL);
      interval.start();
    }
    function bounce(backwards) {
      scroll(getLimit(!backwards), BOUNCE_DURATION, null, true);
    }
    function onScrolled() {
      const position = getPosition();
      const index = Move2.toIndex(position);
      if (!between(index, 0, Splide2.length - 1)) {
        Move2.translate(Move2.shift(position, index > 0), true);
      }
      scrollCallback && scrollCallback();
      emit(EVENT_SCROLLED);
    }
    function computeDuration(distance) {
      return max(distance / BASE_VELOCITY, MIN_DURATION);
    }
    function clear() {
      if (interval) {
        interval.cancel();
      }
    }
    function cancel() {
      if (interval && !interval.isPaused()) {
        clear();
        onScrolled();
      }
    }
    function easing(t) {
      const { easingFunc } = options;
      return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
    }
    return {
      mount,
      destroy: clear,
      scroll,
      cancel
    };
  }
  const FRICTION = 5;
  const LOG_INTERVAL = 200;
  const POINTER_DOWN_EVENTS = "touchstart mousedown";
  const POINTER_MOVE_EVENTS = "touchmove mousemove";
  const POINTER_UP_EVENTS = "touchend touchcancel mouseup";
  function Drag(Splide2, Components2, options) {
    const { on, emit, bind, unbind } = EventInterface(Splide2);
    const { Move: Move2, Scroll: Scroll2, Controller: Controller2 } = Components2;
    const { track } = Components2.Elements;
    const { resolve, orient } = Components2.Direction;
    const { getPosition, exceededLimit } = Move2;
    const listenerOptions = { passive: false, capture: true };
    let basePosition;
    let baseEvent;
    let prevBaseEvent;
    let lastEvent;
    let isFree;
    let isDragging;
    let hasExceeded = false;
    let clickPrevented;
    let disabled;
    let target;
    function mount() {
      bind(track, POINTER_MOVE_EVENTS, noop, listenerOptions);
      bind(track, POINTER_UP_EVENTS, noop, listenerOptions);
      bind(track, POINTER_DOWN_EVENTS, onPointerDown, listenerOptions);
      bind(track, "click", onClick, { capture: true });
      bind(track, "dragstart", prevent);
      on([EVENT_MOUNTED, EVENT_UPDATED], init);
    }
    function init() {
      const { drag } = options;
      disable(!drag);
      isFree = drag === "free";
    }
    function onPointerDown(e) {
      if (!disabled) {
        const isTouch = isTouchEvent(e);
        if (isTouch || !e.button) {
          if (!Move2.isBusy()) {
            target = isTouch ? track : window;
            prevBaseEvent = null;
            lastEvent = null;
            clickPrevented = false;
            bind(target, POINTER_MOVE_EVENTS, onPointerMove, listenerOptions);
            bind(target, POINTER_UP_EVENTS, onPointerUp, listenerOptions);
            Move2.cancel();
            Scroll2.cancel();
            save(e);
          } else {
            prevent(e, true);
          }
        }
      }
    }
    function onPointerMove(e) {
      if (!lastEvent) {
        emit(EVENT_DRAG);
      }
      lastEvent = e;
      if (e.cancelable) {
        if (isDragging) {
          const expired = timeOf(e) - timeOf(baseEvent) > LOG_INTERVAL;
          const exceeded = hasExceeded !== (hasExceeded = exceededLimit());
          if (expired || exceeded) {
            save(e);
          }
          Move2.translate(basePosition + constrain(coordOf(e) - coordOf(baseEvent)));
          emit(EVENT_DRAGGING);
          clickPrevented = true;
          prevent(e);
        } else {
          const diff = abs(coordOf(e) - coordOf(baseEvent));
          let { dragMinThreshold: thresholds } = options;
          thresholds = isObject$1(thresholds) ? thresholds : { mouse: 0, touch: +thresholds || 10 };
          isDragging = diff > (isTouchEvent(e) ? thresholds.touch : thresholds.mouse);
          if (isSliderDirection()) {
            prevent(e);
          }
        }
      }
    }
    function onPointerUp(e) {
      unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
      unbind(target, POINTER_UP_EVENTS, onPointerUp);
      if (lastEvent) {
        if (isDragging || e.cancelable && isSliderDirection()) {
          const velocity = computeVelocity(e);
          const destination = computeDestination(velocity);
          if (isFree) {
            Controller2.scroll(destination);
          } else if (Splide2.is(FADE)) {
            Controller2.go(Splide2.index + orient(sign(velocity)));
          } else {
            Controller2.go(Controller2.toDest(destination), true);
          }
          prevent(e);
        }
        emit(EVENT_DRAGGED);
      }
      isDragging = false;
    }
    function save(e) {
      prevBaseEvent = baseEvent;
      baseEvent = e;
      basePosition = getPosition();
    }
    function onClick(e) {
      if (!disabled && clickPrevented) {
        prevent(e, true);
      }
    }
    function isSliderDirection() {
      const diffX = abs(coordOf(lastEvent) - coordOf(baseEvent));
      const diffY = abs(coordOf(lastEvent, true) - coordOf(baseEvent, true));
      return diffX > diffY;
    }
    function computeVelocity(e) {
      if (Splide2.is(LOOP) || !hasExceeded) {
        const base = baseEvent === lastEvent && prevBaseEvent || baseEvent;
        const diffCoord = coordOf(lastEvent) - coordOf(base);
        const diffTime = timeOf(e) - timeOf(base);
        const isFlick = timeOf(e) - timeOf(lastEvent) < LOG_INTERVAL;
        if (diffTime && isFlick) {
          return diffCoord / diffTime;
        }
      }
      return 0;
    }
    function computeDestination(velocity) {
      return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
    }
    function coordOf(e, orthogonal) {
      return (isTouchEvent(e) ? e.touches[0] : e)[`page${resolve(orthogonal ? "Y" : "X")}`];
    }
    function timeOf(e) {
      return e.timeStamp;
    }
    function isTouchEvent(e) {
      return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
    }
    function constrain(diff) {
      return diff / (hasExceeded && Splide2.is(SLIDE) ? FRICTION : 1);
    }
    function disable(value) {
      disabled = value;
    }
    return {
      mount,
      disable
    };
  }
  const IE_ARROW_KEYS = ["Left", "Right", "Up", "Down"];
  function Keyboard(Splide2, Components2, options) {
    const { on, bind, unbind } = EventInterface(Splide2);
    const { root } = Components2.Elements;
    const { resolve } = Components2.Direction;
    let target;
    function mount() {
      init();
      on(EVENT_UPDATED, () => {
        destroy();
        init();
      });
    }
    function init() {
      const { keyboard = "global" } = options;
      if (keyboard) {
        if (keyboard === "focused") {
          target = root;
          setAttribute(root, TAB_INDEX, 0);
        } else {
          target = window;
        }
        bind(target, "keydown", onKeydown);
      }
    }
    function destroy() {
      unbind(target, "keydown");
      if (isHTMLElement(target)) {
        removeAttribute(target, TAB_INDEX);
      }
    }
    function onKeydown(e) {
      const { key } = e;
      const normalizedKey = includes(IE_ARROW_KEYS, key) ? `Arrow${key}` : key;
      if (normalizedKey === resolve("ArrowLeft")) {
        Splide2.go("<");
      } else if (normalizedKey === resolve("ArrowRight")) {
        Splide2.go(">");
      }
    }
    return {
      mount,
      destroy
    };
  }
  const SRC_DATA_ATTRIBUTE = `${DATA_ATTRIBUTE}-lazy`;
  const SRCSET_DATA_ATTRIBUTE = `${SRC_DATA_ATTRIBUTE}-srcset`;
  const IMAGE_SELECTOR = `[${SRC_DATA_ATTRIBUTE}], [${SRCSET_DATA_ATTRIBUTE}]`;
  function LazyLoad(Splide2, Components2, options) {
    const { on, off, bind, emit } = EventInterface(Splide2);
    const isSequential = options.lazyLoad === "sequential";
    let images = [];
    let index = 0;
    function mount() {
      if (options.lazyLoad) {
        on([EVENT_MOUNTED, EVENT_REFRESH], () => {
          destroy();
          init();
        });
        if (!isSequential) {
          on([EVENT_MOUNTED, EVENT_REFRESH, EVENT_MOVED], observe);
        }
      }
    }
    function init() {
      Components2.Slides.forEach((_Slide) => {
        queryAll(_Slide.slide, IMAGE_SELECTOR).forEach((_img) => {
          const src = getAttribute(_img, SRC_DATA_ATTRIBUTE);
          const srcset = getAttribute(_img, SRCSET_DATA_ATTRIBUTE);
          if (src !== _img.src || srcset !== _img.srcset) {
            const _spinner = create("span", options.classes.spinner, _img.parentElement);
            setAttribute(_spinner, ROLE, "presentation");
            images.push({ _img, _Slide, src, srcset, _spinner });
            display(_img, "none");
          }
        });
      });
      if (isSequential) {
        loadNext();
      }
    }
    function destroy() {
      index = 0;
      images = [];
    }
    function observe() {
      images = images.filter((data) => {
        if (data._Slide.isWithin(Splide2.index, options.perPage * ((options.preloadPages || 1) + 1))) {
          return load(data);
        }
        return true;
      });
      if (!images.length) {
        off(EVENT_MOVED);
      }
    }
    function load(data) {
      const { _img } = data;
      addClass(data._Slide.slide, CLASS_LOADING);
      bind(_img, "load error", (e) => {
        onLoad(data, e.type === "error");
      });
      ["src", "srcset"].forEach((name) => {
        if (data[name]) {
          setAttribute(_img, name, data[name]);
          removeAttribute(_img, name === "src" ? SRC_DATA_ATTRIBUTE : SRCSET_DATA_ATTRIBUTE);
        }
      });
    }
    function onLoad(data, error) {
      const { _Slide } = data;
      removeClass(_Slide.slide, CLASS_LOADING);
      if (!error) {
        remove(data._spinner);
        display(data._img, "");
        emit(EVENT_LAZYLOAD_LOADED, data._img, _Slide);
        emit(EVENT_RESIZE);
      }
      if (isSequential) {
        loadNext();
      }
    }
    function loadNext() {
      if (index < images.length) {
        load(images[index++]);
      }
    }
    return {
      mount,
      destroy
    };
  }
  function Pagination(Splide2, Components2, options) {
    const { on, emit, bind, unbind } = EventInterface(Splide2);
    const { Slides: Slides2, Elements: Elements2, Controller: Controller2 } = Components2;
    const { hasFocus, getIndex } = Controller2;
    const items = [];
    let list;
    function mount() {
      init();
      on([EVENT_UPDATED, EVENT_REFRESH], init);
      on([EVENT_MOVE, EVENT_SCROLLED], update);
    }
    function init() {
      destroy();
      if (options.pagination && Slides2.isEnough()) {
        createPagination();
        emit(EVENT_PAGINATION_MOUNTED, { list, items }, getAt(Splide2.index));
        update();
      }
    }
    function destroy() {
      if (list) {
        remove(list);
        items.forEach((item) => {
          unbind(item.button, "click");
        });
        empty(items);
        list = null;
      }
    }
    function createPagination() {
      const { length } = Splide2;
      const { classes, i18n, perPage } = options;
      const parent = options.pagination === "slider" && Elements2.slider || Elements2.root;
      const max2 = hasFocus() ? length : ceil(length / perPage);
      list = create("ul", classes.pagination, parent);
      for (let i = 0; i < max2; i++) {
        const li = create("li", null, list);
        const button = create("button", { class: classes.page, type: "button" }, li);
        const controls = Slides2.getIn(i).map((Slide2) => Slide2.slide.id);
        const text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
        bind(button, "click", onClick.bind(null, i));
        setAttribute(button, ARIA_CONTROLS, controls.join(" "));
        setAttribute(button, ARIA_LABEL, format(text, i + 1));
        items.push({ li, button, page: i });
      }
    }
    function onClick(page) {
      Controller2.go(`>${page}`, true, () => {
        const Slide2 = Slides2.getAt(Controller2.toIndex(page));
        Slide2 && focus(Slide2.slide);
      });
    }
    function getAt(index) {
      return items[Controller2.toPage(index)];
    }
    function update() {
      const prev = getAt(getIndex(true));
      const curr = getAt(getIndex());
      if (prev) {
        removeClass(prev.button, CLASS_ACTIVE);
        removeAttribute(prev.button, ARIA_CURRENT);
      }
      if (curr) {
        addClass(curr.button, CLASS_ACTIVE);
        setAttribute(curr.button, ARIA_CURRENT, true);
      }
      emit(EVENT_PAGINATION_UPDATED, { list, items }, prev, curr);
    }
    return {
      items,
      mount,
      destroy,
      getAt
    };
  }
  const TRIGGER_KEYS = [" ", "Enter", "Spacebar"];
  function Sync(Splide2, Components2, options) {
    const { splides } = Splide2;
    const { list } = Components2.Elements;
    function mount() {
      if (options.isNavigation) {
        navigate();
      } else {
        sync();
      }
    }
    function destroy() {
      removeAttribute(list, ALL_ATTRIBUTES);
    }
    function sync() {
      const processed = [];
      splides.concat(Splide2).forEach((splide, index, instances) => {
        EventInterface(splide).on(EVENT_MOVE, (index2, prev, dest) => {
          instances.forEach((instance) => {
            if (instance !== splide && !includes(processed, splide)) {
              processed.push(instance);
              instance.go(instance.is(LOOP) ? dest : index2);
            }
          });
          empty(processed);
        });
      });
    }
    function navigate() {
      const { on, emit } = EventInterface(Splide2);
      on(EVENT_CLICK, onClick);
      on(EVENT_SLIDE_KEYDOWN, onKeydown);
      on([EVENT_MOUNTED, EVENT_UPDATED], update);
      setAttribute(list, ROLE, "menu");
      emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
    }
    function update() {
      setAttribute(list, ARIA_ORIENTATION, options.direction !== TTB ? "horizontal" : null);
    }
    function onClick(Slide2) {
      Splide2.go(Slide2.index);
    }
    function onKeydown(Slide2, e) {
      if (includes(TRIGGER_KEYS, e.key)) {
        onClick(Slide2);
        prevent(e);
      }
    }
    return {
      mount,
      destroy
    };
  }
  function Wheel(Splide2, Components2, options) {
    const { bind } = EventInterface(Splide2);
    function mount() {
      if (options.wheel) {
        bind(Components2.Elements.track, "wheel", onWheel, { passive: false, capture: true });
      }
    }
    function onWheel(e) {
      const { deltaY } = e;
      if (deltaY) {
        Splide2.go(deltaY < 0 ? "<" : ">");
        prevent(e);
      }
    }
    return {
      mount
    };
  }
  var ComponentConstructors = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    Options,
    Direction,
    Elements,
    Slides,
    Layout,
    Clones,
    Move,
    Controller,
    Arrows,
    Autoplay,
    Cover,
    Scroll,
    Drag,
    Keyboard,
    LazyLoad,
    Pagination,
    Sync,
    Wheel
  });
  const I18N = {
    prev: "Previous slide",
    next: "Next slide",
    first: "Go to first slide",
    last: "Go to last slide",
    slideX: "Go to slide %s",
    pageX: "Go to page %s",
    play: "Start autoplay",
    pause: "Pause autoplay"
  };
  const DEFAULTS = {
    type: "slide",
    speed: 400,
    waitForTransition: true,
    perPage: 1,
    arrows: true,
    pagination: true,
    interval: 5e3,
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    drag: true,
    direction: "ltr",
    slideFocus: true,
    trimSpace: true,
    focusableNodes: "a, button, textarea, input, select, iframe",
    classes: CLASSES,
    i18n: I18N
  };
  function Fade(Splide2, Components2, options) {
    const { on } = EventInterface(Splide2);
    function mount() {
      on([EVENT_MOUNTED, EVENT_REFRESH], () => {
        nextTick(() => {
          Components2.Slides.style("transition", `opacity ${options.speed}ms ${options.easing}`);
        });
      });
    }
    function start(index, done) {
      const { track } = Components2.Elements;
      style(track, "height", unit(rect(track).height));
      nextTick(() => {
        done();
        style(track, "height", "");
      });
    }
    return {
      mount,
      start,
      cancel: noop
    };
  }
  function Slide(Splide2, Components2, options) {
    const { bind } = EventInterface(Splide2);
    const { Move: Move2, Controller: Controller2 } = Components2;
    const { list } = Components2.Elements;
    let endCallback;
    function mount() {
      bind(list, "transitionend", (e) => {
        if (e.target === list && endCallback) {
          cancel();
          endCallback();
        }
      });
    }
    function start(index, done) {
      const destination = Move2.toPosition(index, true);
      const position = Move2.getPosition();
      const speed = getSpeed(index);
      if (abs(destination - position) >= 1 && speed >= 1) {
        apply(`transform ${speed}ms ${options.easing}`);
        Move2.translate(destination, true);
        endCallback = done;
      } else {
        Move2.jump(index);
        done();
      }
    }
    function cancel() {
      apply("");
    }
    function getSpeed(index) {
      const { rewindSpeed } = options;
      if (Splide2.is(SLIDE) && rewindSpeed) {
        const prev = Controller2.getIndex(true);
        const end = Controller2.getEnd();
        if (prev === 0 && index >= end || prev >= end && index === 0) {
          return rewindSpeed;
        }
      }
      return options.speed;
    }
    function apply(transition) {
      style(list, "transition", transition);
    }
    return {
      mount,
      start,
      cancel
    };
  }
  const _Splide = class {
    constructor(target, options) {
      this.event = EventBus();
      this.Components = {};
      this.state = State(CREATED);
      this.splides = [];
      this._options = {};
      this._Extensions = {};
      const root = isString(target) ? query(document, target) : target;
      assert(root, `${root} is invalid.`);
      this.root = root;
      merge$1(DEFAULTS, _Splide.defaults);
      merge$1(merge$1(this._options, DEFAULTS), options || {});
    }
    mount(Extensions, Transition) {
      const { state, Components: Components2 } = this;
      assert(state.is([CREATED, DESTROYED]), "Already mounted!");
      state.set(CREATED);
      this._Components = Components2;
      this._Transition = Transition || this._Transition || (this.is(FADE) ? Fade : Slide);
      this._Extensions = Extensions || this._Extensions;
      const Constructors = assign({}, ComponentConstructors, this._Extensions, { Transition: this._Transition });
      forOwn$1(Constructors, (Component, key) => {
        const component = Component(this, Components2, this._options);
        Components2[key] = component;
        component.setup && component.setup();
      });
      forOwn$1(Components2, (component) => {
        component.mount && component.mount();
      });
      this.emit(EVENT_MOUNTED);
      addClass(this.root, CLASS_INITIALIZED);
      state.set(IDLE);
      this.emit(EVENT_READY);
      return this;
    }
    sync(splide) {
      this.splides.push(splide);
      splide.splides.push(this);
      return this;
    }
    go(control) {
      this._Components.Controller.go(control);
      return this;
    }
    on(events, callback) {
      this.event.on(events, callback, null, DEFAULT_USER_EVENT_PRIORITY);
      return this;
    }
    off(events) {
      this.event.off(events);
      return this;
    }
    emit(event) {
      this.event.emit(event, ...slice(arguments, 1));
      return this;
    }
    add(slides, index) {
      this._Components.Slides.add(slides, index);
      return this;
    }
    remove(matcher) {
      this._Components.Slides.remove(matcher);
      return this;
    }
    is(type) {
      return this._options.type === type;
    }
    refresh() {
      this.emit(EVENT_REFRESH);
      return this;
    }
    destroy(completely = true) {
      const { event, state } = this;
      if (state.is(CREATED)) {
        event.on(EVENT_READY, this.destroy.bind(this, completely), this);
      } else {
        forOwn$1(this._Components, (component) => {
          component.destroy && component.destroy(completely);
        });
        event.emit(EVENT_DESTROY);
        event.destroy();
        completely && empty(this.splides);
        state.set(DESTROYED);
      }
      return this;
    }
    get options() {
      return this._options;
    }
    set options(options) {
      const { _options } = this;
      merge$1(_options, options);
      if (!this.state.is(CREATED)) {
        this.emit(EVENT_UPDATED, _options);
      }
    }
    get length() {
      return this._Components.Slides.getLength(true);
    }
    get index() {
      return this._Components.Controller.getIndex();
    }
  };
  let Splide$1 = _Splide;
  Splide$1.defaults = {};
  Splide$1.STATES = STATES;
  const EVENTS = [
    EVENT_ACTIVE,
    EVENT_ARROWS_MOUNTED,
    EVENT_ARROWS_UPDATED,
    EVENT_AUTOPLAY_PAUSE,
    EVENT_AUTOPLAY_PLAY,
    EVENT_AUTOPLAY_PLAYING,
    EVENT_CLICK,
    EVENT_DESTROY,
    EVENT_DRAG,
    EVENT_DRAGGED,
    EVENT_DRAGGING,
    EVENT_HIDDEN,
    EVENT_INACTIVE,
    EVENT_LAZYLOAD_LOADED,
    EVENT_MOUNTED,
    EVENT_MOVE,
    EVENT_MOVED,
    EVENT_NAVIGATION_MOUNTED,
    EVENT_PAGINATION_MOUNTED,
    EVENT_PAGINATION_UPDATED,
    EVENT_REFRESH,
    EVENT_RESIZE,
    EVENT_RESIZED,
    EVENT_SCROLL,
    EVENT_SCROLLED,
    EVENT_UPDATED,
    EVENT_VISIBLE
  ];
  function isEqualShallow(array1, array2) {
    return array1.length === array2.length && !array1.some((elm, index) => elm !== array2[index]);
  }
  function isObject(subject) {
    return subject !== null && typeof subject === "object";
  }
  function forOwn(object, iteratee) {
    if (object) {
      const keys = Object.keys(object);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== "__proto__") {
          if (iteratee(object[key], key) === false) {
            break;
          }
        }
      }
    }
    return object;
  }
  function merge(object, source) {
    const merged = object;
    forOwn(source, (value, key) => {
      if (Array.isArray(value)) {
        merged[key] = value.slice();
      } else if (isObject(value)) {
        merged[key] = merge(isObject(merged[key]) ? merged[key] : {}, value);
      } else {
        merged[key] = value;
      }
    });
    return merged;
  }
  var _export_sfc = (sfc, props) => {
    for (const [key, val] of props) {
      sfc[key] = val;
    }
    return sfc;
  };
  const _sfc_main$1 = vue.defineComponent({
    name: "Splide",
    emits: EVENTS.map((event) => `splide:${event}`),
    props: {
      options: Object,
      extensions: Object,
      transition: Function,
      hasSliderWrapper: Boolean
    },
    setup(props, context) {
      const { options } = props;
      const splide = vue.ref();
      const root = vue.ref();
      let slides = [];
      vue.onMounted(() => {
        if (root.value) {
          splide.value = new Splide$1(root.value, props.options);
          bind(splide.value);
          splide.value.mount(props.extensions, props.transition);
        }
      });
      vue.onBeforeUnmount(() => {
        var _a;
        (_a = splide.value) == null ? void 0 : _a.destroy();
      });
      vue.onUpdated(() => {
        if (splide.value) {
          const newSlides = getSlides();
          if (!isEqualShallow(slides, newSlides)) {
            splide.value.refresh();
            slides = newSlides;
          }
        }
      });
      if (options) {
        vue.watch(() => merge({}, options), (options2) => {
          if (splide.value) {
            splide.value.options = options2;
          }
        }, { deep: true });
      }
      const index = vue.computed(() => {
        var _a;
        return ((_a = splide.value) == null ? void 0 : _a.index) || 0;
      });
      const length = vue.computed(() => {
        var _a;
        return ((_a = splide.value) == null ? void 0 : _a.length) || 0;
      });
      function go(control) {
        var _a;
        (_a = splide.value) == null ? void 0 : _a.go(control);
      }
      function sync(target) {
        const { value: main } = splide;
        if (main) {
          main.sync(target);
          remount(main);
          remount(target);
        }
      }
      function bind(splide2) {
        EVENTS.forEach((event) => {
          splide2.on(event, (...args) => {
            context.emit(`splide:${event}`, splide2, ...args);
          });
        });
      }
      function remount(splide2) {
        splide2.destroy(false);
        splide2.mount();
      }
      function getSlides() {
        var _a;
        if (splide.value) {
          const children2 = (_a = splide.value.Components.Elements) == null ? void 0 : _a.list.children;
          return children2 && Array.prototype.slice.call(children2) || [];
        }
        return [];
      }
      return {
        splide,
        root,
        index,
        length,
        go,
        sync
      };
    }
  });
  const _hoisted_1$1 = {
    class: "splide",
    ref: "root"
  };
  const _hoisted_2 = {
    key: 1,
    class: "splide__slider"
  };
  const _hoisted_3 = { class: "splide__track" };
  const _hoisted_4 = { class: "splide__list" };
  const _hoisted_5 = { class: "splide__track" };
  const _hoisted_6 = { class: "splide__list" };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
      _ctx.hasSliderWrapper ? vue.renderSlot(_ctx.$slots, "before-slider", { key: 0 }) : vue.createCommentVNode("", true),
      _ctx.hasSliderWrapper ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
        vue.renderSlot(_ctx.$slots, "before-track"),
        vue.createElementVNode("div", _hoisted_3, [
          vue.createElementVNode("ul", _hoisted_4, [
            vue.renderSlot(_ctx.$slots, "default")
          ])
        ]),
        vue.renderSlot(_ctx.$slots, "after-track")
      ])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
        vue.renderSlot(_ctx.$slots, "before-track"),
        vue.createElementVNode("div", _hoisted_5, [
          vue.createElementVNode("ul", _hoisted_6, [
            vue.renderSlot(_ctx.$slots, "default")
          ])
        ]),
        vue.renderSlot(_ctx.$slots, "after-track")
      ], 64)),
      _ctx.hasSliderWrapper ? vue.renderSlot(_ctx.$slots, "after-slider", { key: 3 }) : vue.createCommentVNode("", true)
    ], 512);
  }
  var Splide = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
  const _sfc_main = vue.defineComponent({
    name: "SplideSlide"
  });
  const _hoisted_1 = { class: "splide__slide" };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("li", _hoisted_1, [
      vue.renderSlot(_ctx.$slots, "default")
    ]);
  }
  var SplideSlide = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
  const VueSplide = {
    install(app) {
      app.component(Splide.name, Splide);
      app.component(SplideSlide.name, SplideSlide);
    }
  };
  exports2.Splide = Splide;
  exports2.SplideSlide = SplideSlide;
  exports2["default"] = VueSplide;
  Object.defineProperty(exports2, "__esModule", { value: true });
  exports2[Symbol.toStringTag] = "Module";
});