declare const __RSUITE_CLASSNAME_PREFIX__: boolean;
declare const __DEV__: boolean;



// cjs modules declerations
declare module 'gulp-swc' {
    import { Transform } from 'stream';

    interface SwcOptions {
        [key: string]: any;
        caller?: {
            name?: string;
            [key: string]: any;
        };
    }

    function gulpSwc(opts?: SwcOptions): Transform;

    export = gulpSwc;
}
