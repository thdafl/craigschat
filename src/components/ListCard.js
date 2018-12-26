import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import getProfile from '../hocs/ProfileCache.js';

const ListCard = ({onClick, owner, title, description, place, tags = null, roommembers, classes}) => {
  const { cardContainer, cardContent, 
    ownerInfoWrapper, mainWrapper, ownerAvatar, ownerNameText, placeTag,
    titleWrapper, titleText, descriptionWrapper, descriptionText, 
    membersAvatarWrapper, membersAvatar, tagsWrapper, categoryTag } = classes;

  const renderAvatars = () => (
    Object.keys(roommembers).map(id => 
      getProfile(id, user => (
        (user.deleted) ? null :
        <Avatar
          key={id}
          className={membersAvatar}
          alt={user.name}
          src={user.photoUrl}
        />
      ))
    )
  )

  const renderTags = () => {
    const tgs = [];
    if (tags) {
      tags.map((t) => 
        tgs.push(
          <Chip 
            key={t} 
            label={"#" + t}
            className={categoryTag}
            color="primary"
            variant="outlined"
          />
        )
      )
    }
    return tgs;
  }

  return (
    <Card className={cardContainer}>
      <CardActionArea onClick={onClick}>
        <CardContent className={cardContent}>
          <div>
            <div className={mainWrapper}>
              <div className={ownerInfoWrapper}>
                <Avatar className={ownerAvatar} alt="user-avatar" src={owner.photoUrl} />
                <Typography className={ownerNameText}>{owner.name}</Typography>
              </div>
              <div>
                {place && <Chip label={place} variant="outlined" className={placeTag} />}
              </div>
            </div>
            <div className={titleWrapper}>
              <Typography className={titleText}>{title}</Typography>
            </div>

            <div className={descriptionWrapper}>
              <Typography className={descriptionText}>{description}</Typography>
            </div>
          </div>

          <div>
            <div className={membersAvatarWrapper}>
              <div style={{display: 'flex'}}>{renderAvatars()}</div>
            </div>

            <div className={tagsWrapper}>
              {renderTags()}
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

const styles = theme => ({
  cardContainer: {
    width: '95%',
    height: 300,
    margin: 10,
    float: 'left'
  },
  cardContent: {
    height: 270,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  mainWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 35
  },
  ownerInfoWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  ownerAvatar: {
    width: '35px',
    height: '35px',
    marginRight: 5
  },
  ownerNameText: {
    fontSize: '15px',
    fontWeight: 600,
    marginRight: 5
  },
  placeTag: {
    height: 25,
    fontSize: '10px',
    fontWeight: 100,
    marginRight: 5
  },
  titleWrapper: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'start',
    maxHeight: 60,
    width: '95%',
    paddingTop: 5, 
  },
  titleText: {
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize: '20px',
    fontWeight: 600, 
  },
  descriptionWrapper: {
    maxHeight: 100,
    textAlign: 'start',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  descriptionText: {
    fontSize: '15px', 
    fontWeight: 100
  },
  membersAvatarWrapper: {
    display: 'flex',
    alignItems: 'center',
    height: 40, 
  },
  membersAvatar: {
    width: '25px',
    height: '25px'
  },
  tagsWrapper: {
    display: 'flex',
    height: 25,
    textAlign: 'right'
  },
  categoryTag: {
    fontSize: '8px',
    fontWeight: 100, 
    height: 22,
    marginRight: 5
  }
});

export default withStyles(styles)(ListCard);
