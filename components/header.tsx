import { useMemo } from 'react';
import useMapHeader from '../store/map-header';

const Header = () => {
    const { title, location } = useMapHeader();

    const fullTitle = useMemo(() => `${title} ${location}`, [title, location]);

    return (
        <div className="flex w-screen bg-fuchsia-500 h-[7.5vh]">
            <div className="mx-auto my-auto flex-1 text-white text-black-border justify-center align-middle center-children text-3xl font-bold">
                {fullTitle}
            </div>
        </div>
    );
};
export default Header;
