import { ChildElement } from './layout';

const EmptyDiv = ({
    className,
    children
}: {
    className?: string;
    children?: ChildElement;
}) => {
    return <div className={className}>{children}</div>;
};

export default EmptyDiv;
