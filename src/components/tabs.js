import React from 'react';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

class SiteTabs extends React.Component {
    static propTypes = {
        currentTab: PropTypes.number.isRequired,
        handleTabChange: PropTypes.func.isRequired,
    };

    render() {
        const { currentTab, handleTabChange } = this.props;

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
    }
}

export default SiteTabs;
