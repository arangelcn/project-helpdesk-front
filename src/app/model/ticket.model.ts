export class Ticket { 
    constructor(
        public id: string,
        public number: number,
        public title: string,
        public status: string,
        public priority: string,
        public image: string,
        public user: string,
        public assignedUser: string,
        public date: string,
        public changes: Array<string>
    ) {}
}