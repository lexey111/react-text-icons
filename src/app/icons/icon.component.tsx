import React from 'react';
import {TIconProps} from './icons.interface';
import {IconsMap} from './icons.map';

export const Icon: React.FC<TIconProps> = (props: TIconProps) => {
    const iconName = props.type ? props.type : 'unknown';

    const iconContent = IconsMap[iconName];

    if (!iconContent) {
        return <div className={'app-icon unknown-icon'}>?</div>; // icon not found
    }

    const viewBox = typeof iconContent['viewBox'] === 'string' ? iconContent['viewBox'] : '64 64 896 896';

    const viewContent = typeof iconContent['content'] !== 'undefined'
        ? iconContent['content'] as JSX.Element
        : iconContent as JSX.Element;

    const className = 'app-icon'
        + ' __type' + props.type
        + (typeof iconContent['ownClass'] === 'string' ? ' ' + iconContent['ownClass'] : '')
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
