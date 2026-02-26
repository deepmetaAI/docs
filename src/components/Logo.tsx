import Image from 'next/image'

export function Logo(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props} className={`flex items-center ${props.className || ''}`}>
      <Image
        src="/logo.svg"
        alt="Cloubic"
        width={120}
        height={28}
        priority
      />
    </div>
  )
}
