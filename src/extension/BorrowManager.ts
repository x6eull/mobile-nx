/**
 * 管理扩展拥有的、不可通过postMessage完整传递的对象，扩展可以通过postMessage调用这些对象上的方法。
 *
 * 注：不能读取属性，只能调用方法。也可以调用对象本身（如果对象是函数）。
 */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
export class BorrowManager {
  private readonly borrowedObjs = new Map<number, BorrowedHandle<unknown>>()
  private curId = 0
  public borrow<O>(obj: O) {
    const borrowedHandle = new BorrowedHandle(++this.curId, obj)
    this.borrowedObjs.set(borrowedHandle.id, borrowedHandle)
    return borrowedHandle
  }

  public applyOn(
    id: number,
    prop: null | string,
    thisArg?: unknown,
    args: unknown[] = [],
  ) {
    if (!this.borrowedObjs.has(id))
      throw new Error(`No borrowed object with id ${id}`)
    const obj = this.borrowedObjs.get(id)?.borrowedObj
    const target = prop === null ? obj : (obj as any)[prop]
    return alert.apply.call(target, thisArg ?? obj, args)
  }
}

export class BorrowedHandle<O> {
  public constructor(
    public readonly id: number,
    public readonly borrowedObj: O,
  ) {}
}
