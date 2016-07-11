// I'm not sure what the final data will look like, but I'm imagining it will be something 
// like this:
// {
//    race: (white|latino|black|asian|mix|other)
//    offense: (murder|robbery|nuisance|dui)
//    stage: (arrest|arraigned|pre-trial|post-trial)
//    cost: 100-500
//    number: 0-250
// }

export type VisDatum = {
  id: string,

  race: string,
  offense: string,
  stage: string,

  cost: number,
  number: number
}
export type VisData = Array<VisDatum>

export let CategoryNames = ["Race", "Offense", "Stage"]

export function GenerateRandomData() : VisData {
  let currentId = 1;
  let result: VisData = [];
  ['White','Latino','Black','Asian','Mix','Other'].forEach(race => {
    ['Murder','Robbery','Drugs','DUI'].forEach(offense => {
      ['Arrest', 'Arraigned', 'Pre-trial', 'Post-trial'].forEach(stage => {
        let cost = Math.floor(Math.random() * 400 + 100);
        let number = (Math.random() < 0.700) ? 0 : Math.floor(Math.random() * 249 + 1);

        result.push({
          id: race + "|" + offense + "|" + stage,
          race: race,
          offense: offense,
          stage: stage,
          cost: cost,
          number: number
        })
      });
    });
  });

  return result.filter(e => { return e.number > 0; });
}