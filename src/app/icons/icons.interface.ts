import {TIconType} from './icons.map';

type TIconMapSimpleContent = JSX.Element;

type TIconMapExtendedContent = {
    content: JSX.Element
    viewBox: string
    ownClass?: string
};

export type TIconMapContent = TIconMapExtendedContent | TIconMapSimpleContent;

export type TIconMapRecord = Record<PropertyKey, TIconMapContent>;

export type TIconProps = {
    type: TIconType
    className?: string
    style?: Record<string, string>
    onClick?: () => void
};
