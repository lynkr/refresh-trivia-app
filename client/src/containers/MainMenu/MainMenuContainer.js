
import React, {Component} from 'react'

import {MainMenu} from '../../components'


class MainMenuContainer extends Component {

    constructor(props) {
        super(props)

        this.state = {
            quizTitles: null
        }

    }

    render() {
        return (
            <MainMenu />
        )
    }
}

export default MainMenuContainer