import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

export const SignInUserItem = ({
  user,
  backToUsersList,
}) => {
  const { t } = useTranslation()
  return (
    <>
      <p className='sign-in-user--title'>
        {t('auth.signInTo')}
      </p>
      <div
        className='sign-in-user--item'
        onClick={() => backToUsersList()}
      >
        <p className='sign-in-user--item-title'>
          {user}
        </p>
      </div>
    </>
  )
}

SignInUserItem.propTypes = {
  user: PropTypes.string.isRequired,
  backToUsersList: PropTypes.func.isRequired,
}

export default memo(SignInUserItem)
