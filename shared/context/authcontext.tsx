import { createContext, useCallback, useMemo, useState } from 'react';

const initialValue = {};
export const Context = createContext(initialValue);

const AuthProvider = (props: any) => {
    const [state, setState] = useState({});

    const providerValue = useMemo(() => ({ ...state }), [state]);
    return (
        <Context.Provider value={providerValue}>
            {props.children}
        </Context.Provider>
    );
};

export default AuthProvider;
