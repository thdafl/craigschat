import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import getProfile from '../hocs/ProfileCache.js';
import Chip from '@material-ui/core/Chip';

const ListCard = ({onClick, owner, title, place, description, roommembers, image, tags, classes}) => {
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
          style={{borderWidth: 2, borderStyle: 'solid', borderColor: 'rgb(255, 255, 255)'}}
        />
      ))
    )
  )

  const renderTags = () => {
    const tgs = [];
    if (tags) {
      tags.map((t) => 
        tgs.push(
          <Chip key={t} label={"#" + t} style={{height: 23, backgroundColor: 'gray', fontSize: 11, fontWeight: 400, color: 'white', marginRight: 3}} />
        )
      )
    }
    return tgs;
  }

  return (
    <Card className={cardContainer}>
      <CardActionArea onClick={onClick} style={{height: '100%'}}>
          <CardMedia
            style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}
            image={(image) ? image : "https://static.vecteezy.com/system/resources/previews/000/200/370/large_2x/simple-low-poly-background-vector.jpg"}
            title="Contemplative Reptile"
          >
          <div style={{height: 60, textAlign: 'start', padding: '10px 20px 20px 20px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            <Typography style={{fontSize: 20, fontWeight: 600, color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>{title}</Typography>
          </div>
          <div className={ownerInfoWrapper}>
              {getProfile(owner.id, user => (
                <Avatar className={ownerAvatar} alt="user-avatar" src={user.photoUrl} />
              ))}
              <div className={membersAvatarWrapper}>
                <div style={{display: 'flex'}}>{renderAvatars()}</div>
                {/* <Chip label={`🐵 ${Object.keys(roommembers).length}`} style={{height: 23, backgroundColor: 'rgb(45, 152, 218)', fontSize: 12, fontWeight: 200, color: 'white', marginRight: 3}} /> */}
                <Chip label={`🎒 12`} style={{height: 23, backgroundColor: 'rgb(45, 152, 218)', fontSize: 12, fontWeight: 200, color: 'white', marginRight: 3}} />
                {/* <Chip label={`✌️ 5`} style={{height: 23, backgroundColor: 'rgb(45, 152, 218)', fontSize: 12, fontWeight: 200, color: 'white', marginRight: 3}} /> */}
              </div>
            </div>
          </CardMedia>

          <CardContent className={cardContent}>
            <div style={{display: 'flex', textAlign: 'start', height: 60, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis'}}>
              <Typography style={{fontSize: 14, fontWeight: 700, color: 'rgb(72, 72, 72)', paddingLeft: 3}}>{description}</Typography>
            </div>
            <div style={{display: 'flex', textAlign: 'start', height: 30, overflow: 'hidden', textOverflow: 'ellipsis'}}>
              <Chip label={place} style={{height: 23, backgroundColor: '#53af87', fontSize: 11, fontWeight: 400, color: 'white', marginRight: 3}} />
              {renderTags()}
            </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

const styles = theme => ({
  cardContainer: {
    width: '100%',
    margin: 10,
    boxShadow: 'none'
  },
  cardContent: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    height: 95
  },
  ownerInfoWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px 10px 20px',
  },
  ownerAvatar: {
    width: '2rem',
    height: '2rem',
    marginRight: 5
  },
  ownerNameText: {
    fontSize: '13px',
    color: 'white',
    textAlign: 'start',
    fontWeight: 600,
    marginRight: 5,
    textShadow: '0 1px 3px rgba(0,0,0,0.8)'
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
    alignItems: 'flex-end',
    width: '100%',
    paddingTop: 5,
    justifyContent: 'space-between'
  },
  membersAvatar: {
    width: '20px',
    height: '20px'
  },
});

export default withStyles(styles)(ListCard);
