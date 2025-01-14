declare global {
  namespace Express {
    interface Request {
      user?: /* UserEntity | null; */ any;
    }
  }
}
