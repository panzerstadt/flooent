import uniq from "lodash.uniq";
import uniqby from "lodash.uniqby";
import shuffle from "lodash.shuffle";
import omit from "lodash.omit";
import clonedeep from "lodash.clonedeep";
import isequal from "lodash.isequal";

class Arrayable extends Array {
  ["constructor"]!: typeof Arrayable;

  first(count?: number) {
    if (count) {
      return (this.slice(0, count) as unknown) as Arrayable;
    }

    return this[0];
  }

  second() {
    return this[1];
  }

  last(count?: number) {
    if (count) {
      return this.slice(this.length - count) as Arrayable;
    }

    return this[this.length - 1];
  }

  nth(index: number) {
    if (index < 0) {
      index = this.length + index;
    }
    return this[index];
  }

  whereNot(key, value = key) {
    if (arguments.length === 1) {
      return this.filter((item) => item !== value) as Arrayable;
    }

    return this.filter((item) => item[key] !== value) as Arrayable;
  }

  where(key, value = key) {
    if (arguments.length === 1) {
      return this.filter((item) => item === value) as Arrayable;
    }

    return this.filter((item) => item[key] === value) as Arrayable;
  }

  whereIn(key, value = key) {
    if (arguments.length === 1) {
      return this.filter((item) => value.includes(item)) as Arrayable;
    }

    return this.filter((item) => value.includes(item[key])) as Arrayable;
  }

  whereNotIn(key, value = key) {
    if (arguments.length === 1) {
      return this.filter((item) => !value.includes(item)) as Arrayable;
    }

    return this.filter((item) => !value.includes(item[key])) as Arrayable;
  }

  filled(key) {
    if (!key) {
      return this.filter((value) => !!value) as Arrayable;
    }

    return this.filter((item) => !!item[key]) as Arrayable;
  }

  clone() {
    // lodash does array.constructor(lenght) which doesn't work on subclassed arrays
    return this.constructor.from(clonedeep([...this])) as Arrayable;
  }

  groupBy(key) {
    return this.reduce<{ [key: string]: Arrayable }>((result, item) => {
      const group = typeof key === "function" ? key(item) : item[key];
      result[group] = result[group] || new this.constructor();
      result[group].push(item);
      return result;
    }, {});
  }

  sum(key) {
    return this.reduce<number>((result, item) => {
      let number = item;
      if (key) {
        number = typeof key === "function" ? key(item) : item[key];
      }
      return result + number;
    }, 0);
  }

  forget(keys) {
    keys = Array.isArray(keys) ? keys : [keys];
    return this.map((item) => {
      return omit(item, keys);
    }) as Arrayable;
  }

  pluck(key) {
    return this.map((item) => item[key]) as Arrayable;
  }

  unique(key) {
    if (!key) {
      return this.constructor.from(uniq(this)) as Arrayable;
    }

    const compareFn = typeof key === "function" ? key : (item) => item[key];
    return this.constructor.from(uniqby(this, compareFn)) as Arrayable;
  }

  shuffle() {
    return this.constructor.from(shuffle(this)) as Arrayable;
  }

  is(compareWith) {
    return isequal(this, compareWith);
  }

  tap(fn): Arrayable {
    fn(this);
    return this;
  }

  pipe(callback) {
    return this.constructor.from(callback(this)) as Arrayable;
  }

  when(comparison, then) {
    const isBoolean = typeof comparison === "boolean";

    if (isBoolean && !comparison) {
      return this;
    }

    if (!isBoolean && !comparison(this)) {
      return this;
    }

    return this.pipe(then);
  }

  quacksLike(duck) {
    return this.is(duck);
  }

  partition(callback) {
    const tuple = [this.constructor.from([]), this.constructor.from([])] as [Arrayable, Arrayable];

    for (const item of this) {
      const index = callback(item) ? 0 : 1;
      tuple[index].push(item);
    }

    return tuple;
  }

  prepend(...items): Arrayable {
    this.unshift(...items);
    return this;
  }

  append(...items): Arrayable {
    this.push(...items);
    return this;
  }

  sortDesc(key) {
    if (!key) {
      return this.constructor.from(this).sort().reverse() as Arrayable;
    }
    return this.constructor
      .from(this)
      .sort((a, b) => b[key] - a[key]) as Arrayable;
  }

  sortAsc(key) {
    if (!key) {
      return this.constructor.from(this).sort() as Arrayable;
    }
    return this.constructor
      .from(this)
      .sort((a, b) => a[key] - b[key]) as Arrayable;
  }
}

export default Arrayable;
