const escape = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export class Raw {
  constructor(s) { this.s = s; }
}

const show = (v) =>
  v instanceof Raw ? v.s : Array.isArray(v) ? v.map(show).join('') : v == null || v === false ? '' : escape(v);

// Tagged template that escapes every interpolation unless it is already a Raw fragment.
export const html = (strings, ...values) => new Raw(strings.reduce((out, s, i) => out + show(values[i - 1]) + s));
