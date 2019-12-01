//test
export const increment = ({commit}) => {
    commit('INCREMENT')
}
export const decrement = ({commit}) => {
    commit('DECREMENT')
}

//以上是es6的写法，其实就相当于：
// export const increment = function({ commit }){
//     commit('INCREMENT');
// }
