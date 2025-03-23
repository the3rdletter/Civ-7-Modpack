declare interface BaseResolvedArguments {
    [argName: string]: {
        Value: string;
        Extra?: string;
        SecondExtra?: string;
        Type?: string;
    };
}
declare interface ResolvedArguments extends BaseResolvedArguments {
    getAsserted(argName: string): string;
};

declare interface ResolvedRequirementSet extends RequirementSet {
    Requirements: ResolvedRequirement[];
}

declare interface ResolvedRequirement {
    Requirement: Requirement;
    Arguments: ResolvedArguments;
}

declare interface ResolvedModifier {
    Modifier: Modifier;
    Arguments: ResolvedArguments;
    CollectionType: string | null | undefined;
    EffectType: string | null | undefined;
    SubjectRequirementSet: ResolvedRequirementSet | null;
    OwnerRequirementSet: ResolvedRequirementSet | null;
}

declare type SubjectType = 'City' | 'Plot' | 'Unit' | 'Player';

declare type CreateSubject<T extends SubjectType = SubjectType, Data> = {
    type: T;
    /**
     * An Empty subject is used when the subject is not available, in order
     * to calculate a "0" yield. This is useful to show in the UI that
     * the yields have been calculated, even if the subject is not available.
     */
    isEmpty: true;
} | ({
    isEmpty: false;
    type: T;
} & Data);

declare type PlotSubject = CreateSubject<'Plot', {
    plot: number;    
    city: City;
    /** Player owning the plot city */
    player: Player;
}>;

declare type CitySubject = CreateSubject<'City', {
    city: City;
    /** City hex plot index */
    plot: number;
    /** Player owning the city */
    player: Player;
}>;

declare type UnitSubject = CreateSubject<'Unit', {
    unit: UnitInstance;
    /** Unit location plot index */
    plot: number;
    /** Player owning the unit */
    player: Player;
}>;

declare type PlayerSubject = CreateSubject<'Player', {
    player: Player;
}>;

declare type Subject = CitySubject | PlotSubject | UnitSubject | PlayerSubject;

declare interface YieldsDelta {
    Amount: {
        [YieldType: string]: number;
    };
    Percent: {
        [YieldType: string]: number;
    };
    AmountNoMultiplier: {
        [YieldType: string]: number;
    };
}

declare interface ResolvedYields {
    [YieldType: string]: number;
}

declare interface UnwrappedPlayerYields {
    [YieldType: string]: {
        /** Amount generated (no negative, e.g. only cities) before percent */
        BaseAmount: number;
        /** Percent applied to base amount */
        Percent: number;
    }
}

declare interface UnitTypeInfo {
    UnitType: Unit;
    Count: number;
    MaintenanceCost: number;
}

declare interface UnitTypesInfo {
    [unitType: string]: UnitTypeInfo;
}

// Execution context