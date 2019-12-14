import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

const SiteTabs = ({ currentTab, handleTabChange }) => {
    return (
        <>
            <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                textColor="inherit"
                color="inherit"
                indicatorColor="secondary"
            >
                <Tab label="Single Player" />
                <Tab label="Cooperative" />
                <Tab label="Overall" />
                <Tab label="Records" />
                <Tab label="About" />
            </Tabs>
        </>
    );
};

export default SiteTabs;
