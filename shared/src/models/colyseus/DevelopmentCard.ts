import {MapSchema, Schema, type} from "@colyseus/schema";
import {nanoid} from "nanoid";
import {
    CardLevel,
    CardLevelType,
    CardLocation,
    CardLocationType,
    DevelopmentCardType,
    Token,
    TokenType
} from "@shared/types";

export class DevelopmentCard extends Schema implements DevelopmentCardType {
    //
    @type("string") id: string
    @type("string") name: string
    @type("number") level: CardLevelType
    @type("string") token: TokenType
    @type("number") prestigePoint: number
    @type({ map: "number" }) cost = new MapSchema<number>()
    @type("boolean") visible: boolean
    @type("string") location: CardLocationType

    constructor() {
        super();
        this.id = nanoid();
        this.name = "";
        this.level = CardLevel.LEVEL1;
        this.token = Token.GOLD;
        this.prestigePoint = 0;
        this.visible = false;
        this.location = CardLocation.DECK
    }
}

const genCostMap = (entries: [string, number][]) => {
    return new MapSchema<number>(new Map(entries))
}

export class CheeseTabby extends DevelopmentCard {
    name = "CHEESE_TABBY"
    level = CardLevel.LEVEL1
    token = Token.EMERALD
    prestigePoint = 1
    cost = genCostMap([
        [Token.DIAMOND, 1],
        [Token.EMERALD, 1],
    ])
}

export class MackerelTabby extends DevelopmentCard {
    name = "MACKEREL_TABBY"
    level = CardLevel.LEVEL1
    token = Token.SAPPHIRE
    prestigePoint = 1
    cost = genCostMap([
        [Token.SAPPHIRE, 1],
        [Token.ONYX, 1],
    ])
}

export const developmentCards: DevelopmentCard[] = [
    new CheeseTabby(),
    new MackerelTabby(),
]