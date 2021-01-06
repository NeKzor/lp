import React from 'react';
import { Link } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

type SiteTabsProps = {
    currentTab: number;
};

const SiteTabs = ({ currentTab }: SiteTabsProps) => {
    return (
        <>
            <Tabs
                value={currentTab !== -1 ? currentTab : 0}
                variant="scrollable"
                textColor="inherit"
                color="inherit"
                indicatorColor="secondary"
            >
                <Tab label="Single Player" component={Link} to="/single-player" />
                <Tab label="Cooperative" component={Link} to="/cooperative" />
                <Tab label="Overall" component={Link} to="/overall" />
                <Tab label="Records" component={Link} to="/records" />
                <Tab label="About" component={Link} to="/about" />
            </Tabs>
        </>
    );
};

export default SiteTabs;
