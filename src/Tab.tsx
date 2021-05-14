import React from 'react';

type TabProps = {
    title: String,
}

const Tab = (props: TabProps) => {

    return (<div>
        <h3>{props.title ? props.title : "To read"}</h3>
    </div>);
}

export default Tab;
