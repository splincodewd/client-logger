export class MyConsole {
  constructor() {
    (Object as any).assign(this, console);
  }
}
