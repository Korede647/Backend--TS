export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hashPassword: string) => Promise<boolean>;
