import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import { fixedFloat } from 'ui/utils'

const AccountSummaryLeo = ({ data }) => {
  const { t } = useTranslation()
  const { leoLev, leoAmountAvg } = data
  const formattedLeoAmount = fixedFloat(leoAmountAvg)

  return (
    <>
      {formattedLeoAmount && (
        <div className='leo-level'>
          <div className='leo-level--row'>
            <div className='leo-level--title'>
              {`${t('summary.leo_level')} ${leoLev}`}
            </div>
          </div>
          <div className='leo-level--sub-title'>
            {`${t('summary.avg_amount')} ${formattedLeoAmount}`}
          </div>
        </div>
      )
    }
    </>
  )
}

AccountSummaryLeo.propTypes = {
  data: PropTypes.shape({
    leoLev: PropTypes.number.isRequired,
    leoAmountAvg: PropTypes.number.isRequired,
  }).isRequired,
}

export default memo(AccountSummaryLeo)
