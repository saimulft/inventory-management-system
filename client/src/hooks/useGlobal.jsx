import { useContext } from 'react';
import { GlobalContext } from '../Providers/GlobalProviders';

const useGlobal = () => {
    const globalInfo = useContext(GlobalContext)
    return globalInfo;
};

export default useGlobal;