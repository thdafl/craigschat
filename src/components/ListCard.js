import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

const ListCard = ({onClick, owner, description}) => {
  return (
    <Card style={{width: '90%', marginTop: '10px', marginBottom: '10px'}}>
      <CardActionArea onClick={onClick}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'lavender', height: '45px'}}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
              <div style={{ display: 'flex', width: '20%', height: '30px', backgroundColor: 'lightsteelblue'}}>
                <div style={{paddingRight: '8px'}}>
                  <Avatar style={{width: '30px', height: '30px'}} alt="user-avator" src={owner.photpUrl} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                  <Typography style={{fontSize: '13px'}}>{owner.name}</Typography>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', width: '20%', backgroundColor: 'seashell'}}>
                <Typography style={{fontSize: '10px'}}>Shibuya</Typography>
              </div>
            </div>

            <div style={{backgroundColor: 'gainsboro'}}>
              <Typography style={{fontSize: '20px', fontWeight: 600, display: 'flex', justifyContent: 'flex-start'}}>{description}</Typography>
            </div>
          </div>
        </CardContent>

        <CardContent style={{backgroundColor: 'lightcyan', display: 'flex', height: '10px', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex'}}>
            <Avatar style={{width: '25px', height: '25px'}} alt="user-avator" src="https://image.flaticon.com/icons/svg/145/145848.svg" />
            <Avatar style={{width: '25px', height: '25px'}} alt="user-avator" src="https://image.flaticon.com/icons/svg/145/145842.svg" />
            <Avatar style={{width: '25px', height: '25px'}} alt="user-avator" src="https://image.flaticon.com/icons/svg/145/145849.svg" />
            <Avatar style={{width: '25px', height: '25px'}} alt="user-avator" src="https://image.flaticon.com/icons/svg/145/145846.svg" />
          </div>
          <div>
            <Chip style={{fontSize: '5px', height: '20px', margin: '3px'}} label="#Social" />
            <Chip style={{fontSize: '5px', height: '20px', margin: '3px'}} label="#International" />
            <Chip style={{fontSize: '5px', height: '20px', margin: '3px'}} label="#Anyone is welcomed" />
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default ListCard;