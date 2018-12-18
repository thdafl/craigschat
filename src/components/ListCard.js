import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const ListCard = ({onClick, owner, title, description, place, tags = [], roommembers}) => {

  const renderAvatars = () => {
    const rms = [];
    if (roommembers) {
      for (let m in roommembers) {
        rms.unshift(<Avatar key={m} style={{width: '25px', height: '25px'}} alt={m} src={roommembers[m].photoUrl} />)
      }
      return rms;
    }
  }

  return (
    <Card style={{width: '95%', height: 300, margin: 10, float: 'left'}}>
      <CardActionArea onClick={onClick}>
        <CardContent style={{ height: '100%' }}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'start', height: 35}}>
            <Avatar style={{width: '35px', height: '35px', marginRight: 5}} alt="user-avator" src={owner.photoUrl} />
            <Typography style={{fontSize: '15px', fontWeight: 600, marginRight: 5}}>{owner.name}</Typography>
          </div>

          <div style={{paddingTop: 5, width: '95%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', height: 35, textAlign: 'start'}}>
            <Typography style={{fontSize: '22px', fontWeight: 600, display: 'flex', justifyContent: 'flex-start'}}>{title}</Typography>
          </div>

          <div style={{height: 130, textAlign: 'start', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            <Typography style={{fontSize: '15px', fontWeight: 100}}>{description}</Typography>
          </div>

          <div style={{display: 'flex', height: 45, alignItems: 'center'}}>
            <div style={{display: 'flex'}}>{renderAvatars()}</div>
          </div>

          <div style={{display: 'flex', height: 25, textAlign: 'right'}}>
            {place &&  <Typography style={{fontSize: '10px', fontWeight: 100, marginRight: 5}}>{place}</Typography>}
            <Typography style={{fontSize: '10px', fontWeight: 100, marginRight: 5}}>Genre here</Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default ListCard;
