import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { connect } from 'react-redux'
import * as actions from '../../store/actions/index'
import Dialog from '../Dialog/Dialog'

const TweetMenu = (props) => {
  const { tweet, tweet: { id: tweetId, createUserId }, profileId, onTweetRemove } = props
  const [tweetMenuEl, setAnchorEl] = React.useState(null)

  const isMyTweet = createUserId === profileId

  const handleTweetMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleTweetMenuSelect = (type) => {
    setAnchorEl(null)
    switch (type) {
      case 'remove':
        return tweetRemoveOrIgnore()
      case 'edit':
        return handleDialogOpen()
      default:
        return null
    }

  }

  const handleTweetMenuClose = () => {
    setAnchorEl(null)

  }

  //----

  const [isTweetEdit, setTweetEdit] = React.useState(false)

  const handleDialogOpen = () => {
    setTweetEdit(true)
  }
  const handleDialogClose = () => {
    setTweetEdit(false)
  }
  const handleDialogSave = (text) => {
    const { tweet: { id }, onTweetEdit } = props
    setTweetEdit(false)
    onTweetEdit(id, text)

  }

  const tweetRemoveOrIgnore = () => {
    if (isMyTweet) {
      onTweetRemove(tweet, profileId) //удаляем твитер из базы и из списка твитов пользователя
    }
  }
  return (
    <>

      <Dialog tweet={tweet} open={isTweetEdit} handleSave={handleDialogSave} handleClose={handleDialogClose}/>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleTweetMenuOpen}>
        <MoreVertIcon/>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={tweetMenuEl}
        keepMounted
        open={Boolean(tweetMenuEl)}
        onClose={handleTweetMenuClose}
      >
        <MenuItem
          onClick={() => handleTweetMenuSelect('remove')}>{isMyTweet ? 'Удалить' : 'Игнорировать пользователя'}</MenuItem>
        {isMyTweet ? <MenuItem onClick={() => handleTweetMenuSelect('edit')}>Редактировать</MenuItem> : null }
      </Menu>
    </>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    onTweetRemove: (tweet, profileId) => dispatch(actions.tweetRemove(tweet, profileId)),
    onTweetEdit: (id, text) => dispatch(actions.tweetEdit(id, text))
  }
}

export default connect(
  (state) => ({ profileId: state.profile.id })
  , mapDispatchToProps
)(TweetMenu)
