import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

const ListCard = ({onClick, owner, description, roommembers}) => {

  const renderAvatars = () => {
    const rms = [];
    if (roommembers) {
      for (let m in roommembers) {
        rms.unshift(<Avatar key={m} style={{width: '25px', height: '25px'}} alt={m} src={roommembers[m].photpUrl} />)
      }
      return rms;
    }
  }

  return (
    <Card style={{width: '100%', marginTop: '10px', marginBottom: '10px'}}>
      <CardActionArea onClick={onClick}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '10px', paddingBottom: '10px'}}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
              <div style={{ display: 'flex', width: '20%'}}>
                <div style={{paddingRight: '8px'}}>
                  <Avatar style={{width: '35px', height: '35px'}} alt="user-avator" src={owner.photoUrl} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                  <Typography style={{fontSize: '13px'}}>{owner.name}</Typography>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', width: '20%'}}>
                <Chip style={{fontSize: '7px', height: '20px'}} color="primary" label="Tokyo" />
              </div>
            </div>

            <div>
              <Typography style={{fontSize: '22px', fontWeight: 600, display: 'flex', justifyContent: 'flex-start'}}>{description}</Typography>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start'}}>
              <Chip style={{fontSize: '5px', height: '20px', margin: '3px'}} label="#Social" />
              <Chip style={{fontSize: '5px', height: '20px', margin: '3px'}} label="#International" />
              <Chip style={{fontSize: '5px', height: '20px', margin: '3px'}} label="#Anyone is welcomed" />
            </div>
          </div>
        </CardContent>

        <CardContent style={{display: 'flex', paddingTop: '10px', paddingBottom: '10px', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex'}}>
            {renderAvatars()}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default ListCard;
