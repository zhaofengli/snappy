Start
  = Comment* fc:FunctionCall Comment* Ws { return fc }

// Function names must be at least 2 characters and must start with a lowercase letter
FunctionName
  = first:[a-z] rest:[a-z0-9]i+ { return first + rest.join('') }

FunctionCall
  = Ws name:FunctionName '(' Comment* Ws args:ArgumentList Ws ')' { return { type: 'FunctionCall', name, args } }
  / Ws name:FunctionName Ws { return { type: 'FunctionCall', name, arguments: [] } }

Argument
  = FunctionCall
  / Genotype
  / Base
  / Number

ArgumentList
  = first:Argument Comment* Ws ',' Comment* Ws rest:ArgumentList { return [first].concat(rest); }
  / first:Argument Comment* Ws ','? Comment* { return [first] }

Base
  = [AGCTDI-]

Genotype
  = allele1:Base ';' allele2:Base { return { type: 'Genotype', allele1, allele2 } }

Number
  = n:[0-9]+ { return parseInt(n.join('')) }
  
Ws
  = [ \t\r\n]*

Comment
  = Ws '#' [^\r\n]* LineEnding? { return null }
  / Ws '<!--' ( !'-->' . )* '-->'
  
LineEnding
  = '\r\n'
  / '\r'
  / '\n'
