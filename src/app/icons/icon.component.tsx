import React from 'react';
import {TIconMapContent, TIconProps} from './icons.interface';
import {IconsMap} from './icons.map';

export const Icon: React.FC<TIconProps> = (props: TIconProps) => {
    const iconRecord = IconsMap[props.type] as TIconMapContent;

    if (!iconRecord) {
        return <div className={'app-icon unknown-icon'}>?</div>; // icon not found
    }

    const viewBox = typeof iconRecord['viewBox'] === 'string' ? iconRecord['viewBox'] : '64 64 896 896';

    const viewContent = typeof iconRecord['content'] !== 'undefined'
        ? iconRecord['content'] as JSX.Element
        : iconRecord as JSX.Element;

    const className = 'app-icon'
        + ' __type_' + (props.type as string)
        + (typeof iconRecord['ownClass'] === 'string' ? ' ' + iconRecord['ownClass'] : '')
        + (props.className ? ' ' + props.className : '');

    if (props.onClick) {
        return <div onClick={props.onClick}>
            <svg
                viewBox={viewBox}
                focusable="false"
                className={className + ' with-click'} style={{...props.style}}>
                {viewContent}
            </svg>
        </div>;
    }

    return <svg
        viewBox={viewBox}
        focusable="false"
        className={className} style={{...props.style}}>
        {viewContent}
    </svg>;
};
