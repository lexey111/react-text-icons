import React from 'react';
import {IconList} from "./icon-list.component";

export const App: React.FC = () => {
    return <div>
        <h1>Hello</h1>
        <p>
            This is an example of text based representation of SVG icons for React applications.
        </p>

        <hr/>
        <IconList/>
        <hr/>

        <p>
            Minimalistic build with:
        </p>
        <ul>
            <li>ESBuild</li>
            <li>TypeScript</li>
            <li>React</li>
        </ul>
        <p>&copy; lexey111, ISC</p>
    </div>;
};
