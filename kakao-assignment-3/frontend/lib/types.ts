export interface Todo {
  id: number;
  text: string;
  is_completed: boolean;
}

export interface TodoCreateInput {
  text: string;
  is_completed?: boolean;
}

export interface TodoUpdateInput {
  text: string;
  is_completed: boolean;
}
