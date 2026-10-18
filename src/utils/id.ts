export function generateId(prefix: string = 'blk'): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < 10; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${Date.now().toString(36)}_${str}`;
}
