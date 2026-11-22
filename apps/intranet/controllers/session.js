import { users } from '../models/index.js';
import * as pages from '../views/pages.js';

const cookieUser = (req) => /(?:^|;\s*)user=([a-z0-9_]+)/.exec(req.headers.cookie ?? '')?.[1];

// shortcut: an unsigned cookie is the identity; a real deployment needs real auth because mosAIc trusts the role we send.
export function current(req, res, next) {
  req.user = users.find(cookieUser(req));
  req.user ? next() : res.redirect('/login');
}

export const loginForm = (req, res) => pages.render(res, 'Ingresar', null, pages.login(users.all()));

export function login(req, res) {
  const user = users.find(req.body?.user);
  if (!user) return pages.render(res, 'Ingresar', null, pages.login(users.all()), 400);
  res.cookie('user', user.id, { httpOnly: true, sameSite: 'lax' }).redirect('/correo');
}

export const logout = (req, res) => res.clearCookie('user').redirect('/login');
