# flooent

Fluent interface to provide an expressive syntax for common manipulations.

Turns logical code

```javascript
// given we have const path = 'App/Controllers/user.js'
const filename = path.substring(path.lastIndexOf('/') + 1)
let name = filename.substring(0, filename.lastIndexOf('.'))
if (!name.endsWith('Controller')) name+= 'Controller'
return name.substring(0, 1).toUpperCase() + name.substring(1)
```

into readable code

```javascript
// given we have const path = 'App/Controllers/user.js'
import { Str } from 'flooent'

Str.of(path)
  .betweenLast('/').andLast('.')
  .endWith('Controller')
  .capitalize()
```

## Arrays

### Initiate

Since we are just subclassing JavaScript's Array, you can instantiate the array the same way

```javascript
import { Arr } from 'flooent'

Arr.from([1, 2, 3])
// or
Arr.of(1, 2, 3)
```

## Strings

```javascript
import { Str } from 'flooent'
```

`Str` extends the native String class and therefore inherits all its methods like `includes` or `substring`.

### Instantiate

```javascript
import { Str } from 'flooent'

Str.of('hello')
// or
Str.from('hello')
// or
new Str('hello')

// You can not only instantiate strings
Str.of(1) // String { '1' }
Str.of(true) // String { 'true' }
Str.of(null) // String { '' }
Str.of(undefined) // String { '' }
Str.of([1, 2]) // String { '1,2' }
Str.of({ a: 1 }) // String { '{a: 1}' }
```

### Fluent methods

#### after

Returns the remaining text after the first occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
Str.of('sub.domain.com').after('.') // String { 'domain.com' }
```

#### afterLast

Returns the remaining text after the last occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
Str.of('sub.domain.com').afterLast('.') // String { 'com' }
```

### before

Returns the text before the first occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
Str.of('sub.domain.com').before('.') // String { 'sub' }
```

### beforeLast

Returns the text before the last occurrence of the given value. If the value does not exist in the string, the entire string is returned unchanged.

```javascript
Str.of('sub.domain.com').beforeLast('.') // String { 'sub.domain' }
```

### between

Returns the text between two given values.

```javascript
Str.of('some@email.com').between('@').and('.') // String { 'email' }
Str.of('some@sub.email.com').between('@').andLast('.') // String { 'sub.email' }
```

### betweenLast

Returns the text between the last occurrence of given value and second function respectively.

```javascript
Str.of('john.doe@email.com:123456').betweenLast('.').and(':') // String { 'com' }
Str.of('App/Models/payment.method.js').betweenLast('/').andLast('.') // String { 'payment.method' }
```

### pipe

Executes callback and transforms result back into an instance of `Str`.

```javascript
Str.of('').pipe(str => str.append('!')) // String { '!' }
```

### when

Executes callback if first given value is evaluates to true. Result will get transformed back into an instance of `Str`.

```javascript
// can be a boolean
Str.of('').when(true, str => str.append('!')) // String { '!' }
Str.of('').when(false, str => str.append('!')) // String { '' }

// or a method
Str.of('hello').when(str => str.endsWith('hello'), str => str.append(' world')) // String { 'hello world' }
Str.of('hi').when(str => str.endsWith('hello'), str => str.append(' world')) // String { 'hello' }
```

### whenEmpty

Executes callback if string is empty. Result will get transformed back into an instance of `Str`.

```javascript
Str.of('').whenEmpty(str => str.append('!')) // String { '!' }
Str.of('hello').whenEmpty(str => str.append('!')) // String { 'hello' }
```

### wrap

Wraps a string with given value

```javascript
Str.of('others').wrap('***') // String { '***others***' }
Str.of('oldschool').wrap('<blink>', '</blink>') // String { '<blink>oldschool</blink>' }
```

### Constraints!

The contraints that apply to `Str` are the same that apply to when you new up a native string using `new String('')` and is just how JavaScript works.

For one, the type will be `object` instead of `string`.

```javascript
typeof Str.of('') // object
typeof '' // string
```

Also:

> `Str` is immutable!

While you can still concatinate a string like this:

```javascript
Str.of('') + '!'
```

which will return a raw string (not an instance of `Str`), you can not mutate `Str` like this:

```javascript
Str.of('') += '!' // ERROR
```

To change the value of a string there are a couple of options.

```javascript
let string = Str.of('')

// overwrite variable completely
string = string + '!' // returns raw string, not `Str`.

// use an available expressive fluent method
string.append('!')

// pipe it through!
string.pipe(str => 'replace existing value with this text only!')
```

You can turn `Str` into a raw string using:

```javascript
Str.of('').valueOf()
// or
Str.of('').toString()
```