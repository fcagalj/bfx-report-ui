import React, { PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import _filter from 'lodash/filter'
import { Classes, Dialog } from '@blueprintjs/core'

import Icon from 'icons'
import config from 'config'
import Select from 'ui/Select'
import PlatformLogo from 'ui/PlatformLogo'
import SubAccount from 'components/SubAccounts/SubAccount'

import { MODES } from '../Auth'
import AuthTypeSelector from '../AuthTypeSelector'

import { propTypes, defaultProps } from './RegisterSubAccounts.props'

class RegisterSubAccounts extends PureComponent {
  static propTypes = propTypes

  static defaultProps = defaultProps

  constructor(props) {
    super()

    const { authData: { email }, users } = props
    const { email: firstUserEmail } = users[0] || {}
    this.state = {
      masterAccEmail: email || firstUserEmail,
    }
  }

  onEmailChange = (email) => {
    this.setState({
      masterAccEmail: email,
    })
  }

  render() {
    const {
      authData,
      authType,
      isMultipleAccsSelected,
      switchMode,
      switchAuthType,
      t,
      users,
    } = this.props
    const { masterAccEmail } = this.state

    const title = config.showFrameworkMode ? t('auth.signUp') : t('auth.title')
    const icon = config.showFrameworkMode ? <Icon.SIGN_UP /> : <Icon.SIGN_IN />

    const preparedUsers = _filter(users, ['isSubAccount', false]).map(user => user.email)

    const classes = classNames(
      'bitfinex-auth',
      'bitfinex-auth-sign-up',
      'bitfinex-auth-sign-up--sub-accs', {
        'bitfinex-auth-sign-up--framework': config.showFrameworkMode,
      },
    )

    return (
      <Dialog
        isOpen
        icon={icon}
        title={title}
        usePortal={false}
        className={classes}
        isCloseButtonShown={false}
      >
        <div className={Classes.DIALOG_BODY}>
          <AuthTypeSelector
            authType={authType}
            switchAuthType={switchAuthType}
          />
          <PlatformLogo />
          <h3 className='master-acc-selector--title'>
            {t('auth.selectMasterAccount')}
          </h3>
          <Select
            loading
            items={preparedUsers}
            value={masterAccEmail}
            onChange={this.onEmailChange}
            className='bitfinex-auth-email'
            popoverClassName='bitfinex-auth-email-popover'
          />
          <>
            <SubAccount
              users={users}
              authData={authData}
              masterAccount={masterAccEmail}
              addMultipleAccsEnabled={!isMultipleAccsSelected}
            />
          </>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            {config.showFrameworkMode && users.length > 0 && (
              <div
                className='bitfinex-auth-mode-switch'
                onClick={() => switchMode(MODES.SIGN_IN)}
              >
                {t('auth.signIn')}
              </div>
            )}
          </div>
        </div>
      </Dialog>
    )
  }
}
export default withTranslation('translations')(RegisterSubAccounts)
