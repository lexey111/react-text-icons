import React from 'react';
import {IconsMap, TIconType} from './icons/icons.map';
import {Icon} from './icons/icon.component';

function displayClick(type: string) {
    alert(`import {Icon} from "./icon.component";
...    
<Icon type={'${type}'} />`);
}

const generatorFn = Object.keys(IconsMap).map(type => <div className={'icon-list-example'} key={type}>
        <Icon type={type as TIconType} onClick={() => displayClick(type)}/>
        <div className={'icon-name'}>{type}</div>
    </div>
);

export const IconList: React.FC = () => {
    return <div>
        <div className={'icon-list'}>
            {generatorFn}

            <div className={'icon-list-example'}>
                <Icon type={'unknown' as TIconType}/>
                <div className={'icon-name'}>unknown</div>
            </div>
        </div>
        <i>&mdash; {Object.keys(IconsMap).length} icons.</i>
    </div>
};
