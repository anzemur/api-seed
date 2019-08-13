export default function ({ app, store, route, redirect }: any) {
  if (route.path === '/') {
    return redirect('/settings');
  }
}
