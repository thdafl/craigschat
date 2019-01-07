import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import getProfile from '../hocs/ProfileCache.js';

const ListCard = ({onClick, owner, title, place, roommembers, classes}) => {
  const { cardContainer, cardContent, ownerInfoWrapper, ownerAvatar, ownerNameText, membersAvatarWrapper, membersAvatar } = classes;

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

  // const renderTags = () => {
  //   const tgs = [];
  //   if (tags) {
  //     tags.map((t) => 
  //       tgs.push(
  //         <Chip 
  //           key={t} 
  //           label={"#" + t}
  //           className={categoryTag}
  //           color="primary"
  //           variant="outlined"
  //         />
  //       )
  //     )
  //   }
  //   return tgs;
  // }

  return (
    <Card className={cardContainer}>
      <CardActionArea onClick={onClick} style={{height: 300}}>
          <CardMedia
            style={{height: 150}}
            image="https://static.vecteezy.com/system/resources/previews/000/156/385/large_2x/vector-guys-at-a-bar-illustration.jpg"
            title="Contemplative Reptile"
          />
          <CardContent className={cardContent}>
            <div style={{height: 60, textAlign: 'start'}}>
              <Typography style={{fontSize: 20, fontWeight: 600}}>{title}</Typography>
            </div>
            <div className={ownerInfoWrapper}>
              {getProfile(owner.id, user => (
                <Avatar className={ownerAvatar} alt="user-avatar" src={user.photoUrl} />
              ))}
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Typography className={ownerNameText}>Owner: {owner.name}</Typography>
                <Typography className={ownerNameText}>Place: {place}</Typography>
              </div>
            </div>
            <div className={membersAvatarWrapper}>
              <div style={{display: 'flex'}}>{renderAvatars()}</div>
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
  },
  cardContent: {
    height: 130,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
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
    fontSize: '13px',
    color: 'gray',
    textAlign: 'start',
    fontWeight: 200,
    marginRight: 5
  },
  titleWrapper: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'start',
    maxHeight: 60,
    width: '95%',
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  titleText: {
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize: '20px',
    fontWeight: 600, 
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
});

export default withStyles(styles)(ListCard);
