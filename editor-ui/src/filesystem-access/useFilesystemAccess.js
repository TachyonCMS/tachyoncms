import { readonly, reactive, ref, computed } from "vue";

import { customAlphabet } from "nanoid";

// TODO Add Platform check for desktop only
import { Platform } from "quasar";

// MAIN EXPORT FUNCTION
export default function useFilesystemAccess() {

    // Map of directory handles
    const dirHandleMap = reactive(new Map());

    // Map of file handles
    const fileHandleMap = reactive(new Map());

    // The Map name for the top level directory selected by the user
    const rootDirName = 'rootDir'

    // Allow setting the rootDir
    const setSourceDir = (dirHandle) => {
        dirHandleMap.set('sourceDir', dirHandle);
    }

    
    return {
        setRootDir
    }
}
