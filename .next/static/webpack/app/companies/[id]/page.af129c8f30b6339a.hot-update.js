"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/companies/[id]/page",{

/***/ "(app-pages-browser)/./src/context/auth-context.tsx":
/*!**************************************!*\
  !*** ./src/context/auth-context.tsx ***!
  \**************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: function() { return /* binding */ AuthProvider; },\n/* harmony export */   useAuth: function() { return /* binding */ useAuth; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* __next_internal_client_entry_do_not_use__ AuthProvider,useAuth auto */ \nvar _s = $RefreshSig$(), _s1 = $RefreshSig$();\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction AuthProvider(param) {\n    let { children } = param;\n    _s();\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Check if user is already logged in\n        const storedUser =  true ? localStorage.getItem(\"user\") : 0;\n        if (storedUser) {\n            setUser(JSON.parse(storedUser));\n        }\n        setIsLoading(false);\n    }, []);\n    const login = async (email, password)=>{\n        setIsLoading(true);\n        try {\n            // In a real app, we would make an API call to validate credentials\n            // For demo purposes, we'll just check if email and password are provided\n            if (email && password) {\n                // Simulate API call delay\n                await new Promise((resolve)=>setTimeout(resolve, 1000));\n                const user = {\n                    id: \"1\",\n                    username: email.split(\"@\")[0],\n                    email\n                };\n                setUser(user);\n                // Store user in localStorage\n                if (true) {\n                    localStorage.setItem(\"user\", JSON.stringify(user));\n                }\n                return true;\n            }\n            return false;\n        } catch (error) {\n            console.error(\"Login error:\", error);\n            return false;\n        } finally{\n            setIsLoading(false);\n        }\n    };\n    const signup = async (email, password, username)=>{\n        setIsLoading(true);\n        try {\n            // In a real app, we would make an API call to create a new user\n            // For demo purposes, we'll just check if all required fields are provided\n            if (email && password && username) {\n                // Simulate API call delay\n                await new Promise((resolve)=>setTimeout(resolve, 1000));\n                const user = {\n                    id: Date.now().toString(),\n                    username,\n                    email\n                };\n                setUser(user);\n                // Store user in localStorage\n                if (true) {\n                    localStorage.setItem(\"user\", JSON.stringify(user));\n                }\n                return true;\n            }\n            return false;\n        } catch (error) {\n            console.error(\"Signup error:\", error);\n            return false;\n        } finally{\n            setIsLoading(false);\n        }\n    };\n    const logout = ()=>{\n        setUser(null);\n        // Remove user from localStorage\n        if (true) {\n            localStorage.removeItem(\"user\");\n        }\n    };\n    const value = {\n        user,\n        isLoading,\n        login,\n        signup,\n        logout\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\vicen\\\\Documents\\\\JavaScript Course\\\\Data Privacy App\\\\src\\\\context\\\\auth-context.tsx\",\n        lineNumber: 123,\n        columnNumber: 10\n    }, this);\n}\n_s(AuthProvider, \"YajQB7LURzRD+QP5gw0+K2TZIWA=\");\n_c = AuthProvider;\nfunction useAuth() {\n    _s1();\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error(\"useAuth must be used within an AuthProvider\");\n    }\n    return context;\n}\n_s1(useAuth, \"b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=\");\nvar _c;\n$RefreshReg$(_c, \"AuthProvider\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb250ZXh0L2F1dGgtY29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVrRjtBQWdCbEYsTUFBTUksNEJBQWNKLG9EQUFhQSxDQUE4Qks7QUFFeEQsU0FBU0MsYUFBYSxLQUFxQztRQUFyQyxFQUFFQyxRQUFRLEVBQTJCLEdBQXJDOztJQUMzQixNQUFNLENBQUNDLE1BQU1DLFFBQVEsR0FBR1AsK0NBQVFBLENBQWM7SUFDOUMsTUFBTSxDQUFDUSxXQUFXQyxhQUFhLEdBQUdULCtDQUFRQSxDQUFDO0lBRTNDQyxnREFBU0EsQ0FBQztRQUNSLHFDQUFxQztRQUNyQyxNQUFNUyxhQUFhLEtBQWtCLEdBQWNDLGFBQWFDLE9BQU8sQ0FBQyxVQUFVLENBQUk7UUFFdEYsSUFBSUYsWUFBWTtZQUNkSCxRQUFRTSxLQUFLQyxLQUFLLENBQUNKO1FBQ3JCO1FBRUFELGFBQWE7SUFDZixHQUFHLEVBQUU7SUFFTCxNQUFNTSxRQUFRLE9BQU9DLE9BQWVDO1FBQ2xDUixhQUFhO1FBRWIsSUFBSTtZQUNGLG1FQUFtRTtZQUNuRSx5RUFBeUU7WUFDekUsSUFBSU8sU0FBU0MsVUFBVTtnQkFDckIsMEJBQTBCO2dCQUMxQixNQUFNLElBQUlDLFFBQVFDLENBQUFBLFVBQVdDLFdBQVdELFNBQVM7Z0JBRWpELE1BQU1iLE9BQU87b0JBQ1hlLElBQUk7b0JBQ0pDLFVBQVVOLE1BQU1PLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDN0JQO2dCQUNGO2dCQUVBVCxRQUFRRDtnQkFFUiw2QkFBNkI7Z0JBQzdCLElBQUksSUFBa0IsRUFBYTtvQkFDakNLLGFBQWFhLE9BQU8sQ0FBQyxRQUFRWCxLQUFLWSxTQUFTLENBQUNuQjtnQkFDOUM7Z0JBRUEsT0FBTztZQUNUO1lBRUEsT0FBTztRQUNULEVBQUUsT0FBT29CLE9BQU87WUFDZEMsUUFBUUQsS0FBSyxDQUFDLGdCQUFnQkE7WUFDOUIsT0FBTztRQUNULFNBQVU7WUFDUmpCLGFBQWE7UUFDZjtJQUNGO0lBRUEsTUFBTW1CLFNBQVMsT0FBT1osT0FBZUMsVUFBa0JLO1FBQ3JEYixhQUFhO1FBRWIsSUFBSTtZQUNGLGdFQUFnRTtZQUNoRSwwRUFBMEU7WUFDMUUsSUFBSU8sU0FBU0MsWUFBWUssVUFBVTtnQkFDakMsMEJBQTBCO2dCQUMxQixNQUFNLElBQUlKLFFBQVFDLENBQUFBLFVBQVdDLFdBQVdELFNBQVM7Z0JBRWpELE1BQU1iLE9BQU87b0JBQ1hlLElBQUlRLEtBQUtDLEdBQUcsR0FBR0MsUUFBUTtvQkFDdkJUO29CQUNBTjtnQkFDRjtnQkFFQVQsUUFBUUQ7Z0JBRVIsNkJBQTZCO2dCQUM3QixJQUFJLElBQWtCLEVBQWE7b0JBQ2pDSyxhQUFhYSxPQUFPLENBQUMsUUFBUVgsS0FBS1ksU0FBUyxDQUFDbkI7Z0JBQzlDO2dCQUVBLE9BQU87WUFDVDtZQUVBLE9BQU87UUFDVCxFQUFFLE9BQU9vQixPQUFPO1lBQ2RDLFFBQVFELEtBQUssQ0FBQyxpQkFBaUJBO1lBQy9CLE9BQU87UUFDVCxTQUFVO1lBQ1JqQixhQUFhO1FBQ2Y7SUFDRjtJQUVBLE1BQU11QixTQUFTO1FBQ2J6QixRQUFRO1FBRVIsZ0NBQWdDO1FBQ2hDLElBQUksSUFBa0IsRUFBYTtZQUNqQ0ksYUFBYXNCLFVBQVUsQ0FBQztRQUMxQjtJQUNGO0lBRUEsTUFBTUMsUUFBUTtRQUNaNUI7UUFDQUU7UUFDQU87UUFDQWE7UUFDQUk7SUFDRjtJQUVBLHFCQUFPLDhEQUFDOUIsWUFBWWlDLFFBQVE7UUFBQ0QsT0FBT0E7a0JBQVE3Qjs7Ozs7O0FBQzlDO0dBdkdnQkQ7S0FBQUE7QUF5R1QsU0FBU2dDOztJQUNkLE1BQU1DLFVBQVV0QyxpREFBVUEsQ0FBQ0c7SUFFM0IsSUFBSW1DLFlBQVlsQyxXQUFXO1FBQ3pCLE1BQU0sSUFBSW1DLE1BQU07SUFDbEI7SUFFQSxPQUFPRDtBQUNUO0lBUmdCRCIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvY29udGV4dC9hdXRoLWNvbnRleHQudHN4PzY1ZTUiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnO1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCwgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnO1xyXG5cclxudHlwZSBVc2VyID0ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgdXNlcm5hbWU6IHN0cmluZztcclxuICBlbWFpbDogc3RyaW5nO1xyXG59O1xyXG5cclxudHlwZSBBdXRoQ29udGV4dFR5cGUgPSB7XHJcbiAgdXNlcjogVXNlciB8IG51bGw7XHJcbiAgaXNMb2FkaW5nOiBib29sZWFuO1xyXG4gIGxvZ2luOiAoZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZykgPT4gUHJvbWlzZTxib29sZWFuPjtcclxuICBzaWdudXA6IChlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCB1c2VybmFtZTogc3RyaW5nKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xyXG4gIGxvZ291dDogKCkgPT4gdm9pZDtcclxufTtcclxuXHJcbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxBdXRoQ29udGV4dFR5cGUgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3ROb2RlIH0pIHtcclxuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZTxVc2VyIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBpcyBhbHJlYWR5IGxvZ2dlZCBpblxyXG4gICAgY29uc3Qgc3RvcmVkVXNlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKSA6IG51bGw7XHJcbiAgICBcclxuICAgIGlmIChzdG9yZWRVc2VyKSB7XHJcbiAgICAgIHNldFVzZXIoSlNPTi5wYXJzZShzdG9yZWRVc2VyKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldElzTG9hZGluZyhmYWxzZSk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBsb2dpbiA9IGFzeW5jIChlbWFpbDogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XHJcbiAgICBzZXRJc0xvYWRpbmcodHJ1ZSk7XHJcbiAgICBcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIEluIGEgcmVhbCBhcHAsIHdlIHdvdWxkIG1ha2UgYW4gQVBJIGNhbGwgdG8gdmFsaWRhdGUgY3JlZGVudGlhbHNcclxuICAgICAgLy8gRm9yIGRlbW8gcHVycG9zZXMsIHdlJ2xsIGp1c3QgY2hlY2sgaWYgZW1haWwgYW5kIHBhc3N3b3JkIGFyZSBwcm92aWRlZFxyXG4gICAgICBpZiAoZW1haWwgJiYgcGFzc3dvcmQpIHtcclxuICAgICAgICAvLyBTaW11bGF0ZSBBUEkgY2FsbCBkZWxheVxyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgdXNlciA9IHtcclxuICAgICAgICAgIGlkOiAnMScsXHJcbiAgICAgICAgICB1c2VybmFtZTogZW1haWwuc3BsaXQoJ0AnKVswXSxcclxuICAgICAgICAgIGVtYWlsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBzZXRVc2VyKHVzZXIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFN0b3JlIHVzZXIgaW4gbG9jYWxTdG9yYWdlXHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0xvZ2luIGVycm9yOicsIGVycm9yKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBzaWdudXAgPSBhc3luYyAoZW1haWw6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZywgdXNlcm5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gICAgc2V0SXNMb2FkaW5nKHRydWUpO1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBJbiBhIHJlYWwgYXBwLCB3ZSB3b3VsZCBtYWtlIGFuIEFQSSBjYWxsIHRvIGNyZWF0ZSBhIG5ldyB1c2VyXHJcbiAgICAgIC8vIEZvciBkZW1vIHB1cnBvc2VzLCB3ZSdsbCBqdXN0IGNoZWNrIGlmIGFsbCByZXF1aXJlZCBmaWVsZHMgYXJlIHByb3ZpZGVkXHJcbiAgICAgIGlmIChlbWFpbCAmJiBwYXNzd29yZCAmJiB1c2VybmFtZSkge1xyXG4gICAgICAgIC8vIFNpbXVsYXRlIEFQSSBjYWxsIGRlbGF5XHJcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB1c2VyID0ge1xyXG4gICAgICAgICAgaWQ6IERhdGUubm93KCkudG9TdHJpbmcoKSwgLy8gR2VuZXJhdGUgYSB1bmlxdWUgSURcclxuICAgICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgICAgZW1haWxcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNldFVzZXIodXNlcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gU3RvcmUgdXNlciBpbiBsb2NhbFN0b3JhZ2VcclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgSlNPTi5zdHJpbmdpZnkodXNlcikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignU2lnbnVwIGVycm9yOicsIGVycm9yKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBsb2dvdXQgPSAoKSA9PiB7XHJcbiAgICBzZXRVc2VyKG51bGwpO1xyXG4gICAgXHJcbiAgICAvLyBSZW1vdmUgdXNlciBmcm9tIGxvY2FsU3RvcmFnZVxyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyJyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdmFsdWUgPSB7XHJcbiAgICB1c2VyLFxyXG4gICAgaXNMb2FkaW5nLFxyXG4gICAgbG9naW4sXHJcbiAgICBzaWdudXAsXHJcbiAgICBsb2dvdXRcclxuICB9O1xyXG5cclxuICByZXR1cm4gPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0+e2NoaWxkcmVufTwvQXV0aENvbnRleHQuUHJvdmlkZXI+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNlQXV0aCgpIHtcclxuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChBdXRoQ29udGV4dCk7XHJcbiAgXHJcbiAgaWYgKGNvbnRleHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoIG11c3QgYmUgdXNlZCB3aXRoaW4gYW4gQXV0aFByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59ICJdLCJuYW1lcyI6WyJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiQXV0aENvbnRleHQiLCJ1bmRlZmluZWQiLCJBdXRoUHJvdmlkZXIiLCJjaGlsZHJlbiIsInVzZXIiLCJzZXRVc2VyIiwiaXNMb2FkaW5nIiwic2V0SXNMb2FkaW5nIiwic3RvcmVkVXNlciIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJsb2dpbiIsImVtYWlsIiwicGFzc3dvcmQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJpZCIsInVzZXJuYW1lIiwic3BsaXQiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiZXJyb3IiLCJjb25zb2xlIiwic2lnbnVwIiwiRGF0ZSIsIm5vdyIsInRvU3RyaW5nIiwibG9nb3V0IiwicmVtb3ZlSXRlbSIsInZhbHVlIiwiUHJvdmlkZXIiLCJ1c2VBdXRoIiwiY29udGV4dCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/context/auth-context.tsx\n"));

/***/ })

});