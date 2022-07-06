/** Page<T> class for pagination in backend  */
export interface Page<T> {
    content: T[];
    pageable: {
        sort: Sort[];
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    sort: Sort[];
    number: number;
    size: number;
    numberOfElements: number;
    empty: boolean;
}

/** Sort class in backend */
interface Sort {
    direction: string;
    property: string;
    ignoreCase: boolean;
    nullHandling: string;
    descending: boolean;
    ascending: boolean;
}

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    nickname: string | null;
    imageUrl: string | null;
}

export interface Friend {
    id: string;
    fromUser: UserResponse;
    toUser: UserResponse;
}

export interface FriendRequest {
    id: string;
    fromUser: UserResponse;
    toUser: UserResponse;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
