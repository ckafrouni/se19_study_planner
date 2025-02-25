import { Context } from 'elysia'

export async function POST({ cookie, redirect }: Context) {
  cookie['userId'].remove()
  return redirect('/')
}
