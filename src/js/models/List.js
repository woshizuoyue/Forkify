import uniqid from 'uniqid';
export default class List{

    constructor(){
        this.item = [];
    }

    addItem(count, unit, ingredient){

        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        this.item.push(item);

        return item;
    }

    deleteItem(id){

        const index = this.item.findIndex(el => el.id === id);
        //[2,4,8] splice(1,2) -> return [4,8], original array is [2]; splice(startpos, number splice);

        //[2,4,8] slice(1,2) - > return 4, original array is [2,4,8]; slice(startpos, endpos);

        this.item.splice(index, 1);
    }

    updateCount(id, newCount){

        this.item.find(el => el.id === id).count = newCount;
    }
}