/**
 * [학습 포인트] 제어 컴포넌트 (Controlled Component) 심화
 *
 * 검색바도 Controlled Component 패턴을 사용합니다.
 * 부모가 value와 onChange를 전달하고, 자식은 그대로 표시만 합니다.
 *
 * [Props 구조분해]
 * function SearchBar({ value, onChange, placeholder })
 * → props 객체에서 필요한 것만 꺼내서 사용
 * → props.value 대신 value로 바로 접근 가능
 */

function SearchBar({ value, onChange, placeholder = '검색어를 입력하세요' }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all
          text-sm"
      />
    </div>
  )
}

export default SearchBar
