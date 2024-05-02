export class attachment {
    id: string;
    name: string;
    type: string;
    size: number;
    file: File | null;
    url: string | null;

    constructor(
        id: string,
        name: string,
        type: string,
        size: number,
        file: File | null,
        url: string | null
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.file = file;
        this.url = url;
    }
}